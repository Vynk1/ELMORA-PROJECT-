import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingScreen from '../components/LoadingScreen';

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  avatar: string;
  bio: string;
  location: string;
  birthday: string;
  interests: string[];
  goals: string[];
  stats: {
    tasksCompleted: number;
    daysActive: number;
    longestStreak: number;
    totalPoints: number;
    meditationMinutes: number;
    journalEntries: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedDate: string;
    rarity: 'common' | 'rare' | 'legendary';
  }>;
  moodHistory: Array<{
    date: string;
    mood: 'sad' | 'mid' | 'amazing';
  }>;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats' | 'activity'>('overview');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({ name: '', bio: '', location: '', interests: [] as string[] });
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    joinDate: '',
    avatar: '',
    bio: '',
    location: '',
    birthday: '',
    interests: [],
    goals: [],
    stats: {
      tasksCompleted: 0,
      daysActive: 0,
      longestStreak: 0,
      totalPoints: 0,
      meditationMinutes: 0,
      journalEntries: 0,
    },
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Completed your first task',
        icon: '👶',
        unlockedDate: '2024-01-01',
        rarity: 'common'
      },
      {
        id: '2',
        title: 'Week Warrior',
        description: '7-day task completion streak',
        icon: '🔥',
        unlockedDate: '2024-01-08',
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'Mindful Master',
        description: 'Completed 50 meditation sessions',
        icon: '🧘',
        unlockedDate: '2024-01-20',
        rarity: 'rare'
      },
      {
        id: '4',
        title: 'Journal Journeyer',
        description: 'Written 25 journal entries',
        icon: '📖',
        unlockedDate: '2024-01-25',
        rarity: 'common'
      },
      {
        id: '5',
        title: 'Unstoppable',
        description: '30-day active streak',
        icon: '💎',
        unlockedDate: '2024-01-30',
        rarity: 'legendary'
      }
    ],
    moodHistory: []
  });

  // Fetch user profile data from database
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, bio, avatar_url, created_at')
          .eq('user_id', user.id)
          .single();

        console.log('Profile fetch result:', { profileData, profileError });

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }

        // Fetch email from auth user
        const email = user.email || '';

        // Generate avatar URL if not set
        const avatarUrl = profileData?.avatar_url || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileData?.display_name || user.email || 'user')}`;

        console.log('Avatar URL:', avatarUrl);
        console.log('Display name:', profileData?.display_name);
        console.log('Bio:', profileData?.bio);

        // Update profile state with fetched data
        setProfile(prev => ({
          ...prev,
          name: profileData?.display_name || '',
          email: email,
          joinDate: profileData?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          avatar: avatarUrl,
          bio: profileData?.bio || '',
        }));
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateEditForm = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const startEditing = () => {
    setEditForm({
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests,
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;

    try {
      setUploading(true);

      // Compress and upload image
      const fileName = `${user.id}_${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const avatarUrl = publicData.publicUrl;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be smaller than 10MB');
        return;
      }

      handlePhotoUpload(file);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      console.log('Saving profile with data:', {
        display_name: editForm.name,
        bio: editForm.bio,
        user_id: user.id
      });

      const { data, error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.name,
          bio: editForm.bio,
        })
        .eq('user_id', user.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Error updating profile:', error);
        alert(`Failed to update profile: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('No rows updated. Profile might not exist.');
        alert('Profile not found. Please try again.');
        return;
      }

      // Update the main profile state with saved data
      setProfile(prev => ({
        ...prev,
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        interests: editForm.interests,
      }));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
      console.log('Profile saved successfully:', data);
    } catch (error) {
      console.error('Error in saveProfile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '👤' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'stats', name: 'Statistics', icon: '📊' },
    { id: 'activity', name: 'Activity', icon: '📈' },
  ];

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    legendary: 'bg-purple-100 text-purple-800'
  };

  const moodEmojis = {
    sad: '🌧️',
    mid: '⛅',
    amazing: '☀️'
  };


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="p-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full bg-gray-200 object-cover"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
                title="Change profile photo"
              >
                {uploading ? '...' : '📷'}
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-light text-gray-800 mb-2">{profile.name}</h1>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              <p className="text-gray-500 text-sm mb-3">
                📍 {profile.location} • Member since {new Date(profile.joinDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{profile.bio}</p>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={isEditing ? cancelEditing : startEditing}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile.stats.tasksCompleted}</div>
              <div className="text-xs text-gray-600">Tasks Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.stats.daysActive}</div>
              <div className="text-xs text-gray-600">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profile.stats.longestStreak}</div>
              <div className="text-xs text-gray-600">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.stats.totalPoints}</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.stats.meditationMinutes}</div>
              <div className="text-xs text-gray-600">Minutes Meditated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{profile.stats.journalEntries}</div>
              <div className="text-xs text-gray-600">Journal Entries</div>
            </div>
          </div>
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Edit Profile</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => updateEditForm('name', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => updateEditForm('location', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => updateEditForm('bio', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-2xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <input
                  type="text"
                  value={editForm.interests.join(', ')}
                  onChange={(e) => updateEditForm('interests', e.target.value.split(', ').filter(i => i.trim()))}
                  className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Meditation, Reading, Yoga..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={cancelEditing}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="flex-1 py-3 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Interests */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-2xl text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Goals */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Current Goals</h3>
                <div className="space-y-3">
                  {profile.goals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                      <span className="text-lg">🎯</span>
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Mood */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Mood Patterns</h3>
                <div className="flex space-x-2">
                  {profile.moodHistory.slice(0, 7).map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-1">{moodEmojis[day.mood]}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-2xl font-light text-gray-800 mb-6">Your Achievements</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${rarityColors[achievement.rarity]}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="text-xs text-gray-500">
                      Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-light text-gray-800 mb-6">Detailed Statistics</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h4 className="font-medium text-blue-800 mb-4">Task Completion</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Completed:</span>
                        <span className="font-medium text-blue-800">{profile.stats.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">This Week:</span>
                        <span className="font-medium text-blue-800">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Success Rate:</span>
                        <span className="font-medium text-blue-800">87%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6">
                    <h4 className="font-medium text-green-800 mb-4">Wellness Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Meditation Minutes:</span>
                        <span className="font-medium text-green-800">{profile.stats.meditationMinutes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Journal Entries:</span>
                        <span className="font-medium text-green-800">{profile.stats.journalEntries}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Goals Achieved:</span>
                        <span className="font-medium text-green-800">12</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h4 className="font-medium text-purple-800 mb-4">Engagement</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Days Active:</span>
                        <span className="font-medium text-purple-800">{profile.stats.daysActive}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Longest Streak:</span>
                        <span className="font-medium text-purple-800">{profile.stats.longestStreak} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Current Streak:</span>
                        <span className="font-medium text-purple-800">5 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-6">
                    <h4 className="font-medium text-orange-800 mb-4">Social & Rewards</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-orange-700">Total Points:</span>
                        <span className="font-medium text-orange-800">{profile.stats.totalPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700">Friends:</span>
                        <span className="font-medium text-orange-800">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700">Encouragements Sent:</span>
                        <span className="font-medium text-orange-800">34</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-light text-gray-800 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {[
                  { time: '2 hours ago', action: 'Completed daily meditation', icon: '🧘', color: 'text-green-600' },
                  { time: '5 hours ago', action: 'Finished 8 of 10 tasks', icon: '✅', color: 'text-blue-600' },
                  { time: '1 day ago', action: 'Wrote journal entry: "Feeling grateful"', icon: '📖', color: 'text-purple-600' },
                  { time: '1 day ago', action: 'Sent encouragement to Sarah M.', icon: '💌', color: 'text-pink-600' },
                  { time: '2 days ago', action: 'Achieved 7-day streak!', icon: '🔥', color: 'text-orange-600' },
                  { time: '3 days ago', action: 'Unlocked "Mindful Master" achievement', icon: '🏆', color: 'text-yellow-600' },
                  { time: '3 days ago', action: 'Completed goal: "Read 2 books this month"', icon: '🎯', color: 'text-indigo-600' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
