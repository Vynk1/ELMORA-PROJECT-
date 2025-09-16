import React, { useState } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  title: string;
  content: string;
  tags: string[];
  gratitude?: string[];
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      mood: 'happy',
      title: 'Great progress today!',
      content: 'I completed all my tasks and felt really productive. The meditation session this morning helped me stay focused throughout the day.',
      tags: ['productivity', 'meditation', 'focus'],
      gratitude: ['Peaceful morning', 'Supportive friends', 'Good health']
    },
    {
      id: '2',
      date: '2024-01-14',
      mood: 'reflective',
      title: 'Thinking about growth',
      content: 'Some days are harder than others, but I\'m learning to appreciate the small wins. Even taking a shower felt like an achievement today.',
      tags: ['self-care', 'growth', 'mindfulness'],
      gratitude: ['Warm water', 'Comfortable bed', 'This app helping me']
    }
  ]);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const moodEmojis = {
    'amazing': '🤩',
    'happy': '😊',
    'content': '😌',
    'neutral': '😐',
    'reflective': '🤔',
    'sad': '😢',
    'anxious': '😰',
    'frustrated': '😤'
  };

  const NewEntryModal = () => {
    const [newEntry, setNewEntry] = useState({
      mood: 'neutral',
      title: '',
      content: '',
      tags: '',
      gratitude: ''
    });

    const handleSubmit = () => {
      if (newEntry.title.trim() && newEntry.content.trim()) {
        const entry: JournalEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          mood: newEntry.mood,
          title: newEntry.title.trim(),
          content: newEntry.content.trim(),
          tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          gratitude: newEntry.gratitude.split(',').map(item => item.trim()).filter(item => item)
        };
        setEntries([entry, ...entries]);
        setShowNewEntry(false);
        setNewEntry({ mood: 'neutral', title: '', content: '', tags: '', gratitude: '' });
      }
    };

    if (!showNewEntry) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-light text-gray-800 mb-6">New Journal Entry</h3>
          
          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">How are you feeling?</label>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    onClick={() => setNewEntry({...newEntry, mood})}
                    className={`
                      p-3 rounded-2xl text-center transition-all
                      ${newEntry.mood === mood
                        ? 'bg-primary text-white scale-105'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className="text-xs capitalize">{mood}</div>
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
            />
            
            <textarea
              placeholder="Write about your day, thoughts, feelings..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-2xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <input
              type="text"
              placeholder="Tags (comma separated): mood, work, family"
              value={newEntry.tags}
              onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <textarea
              placeholder="What are you grateful for today? (comma separated)"
              value={newEntry.gratitude}
              onChange={(e) => setNewEntry({...newEntry, gratitude: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-2xl h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowNewEntry(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90"
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EntryDetailModal = () => {
    if (!selectedEntry) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-light text-gray-800 mb-2">{selectedEntry.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{new Date(selectedEntry.date).toLocaleDateString()}</span>
                <span className="flex items-center space-x-1">
                  <span>{moodEmojis[selectedEntry.mood as keyof typeof moodEmojis]}</span>
                  <span className="capitalize">{selectedEntry.mood}</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="prose prose-gray max-w-none mb-6">
            <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
          </div>

          {selectedEntry.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedEntry.gratitude && selectedEntry.gratitude.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Gratitude</h4>
              <ul className="space-y-1">
                {selectedEntry.gratitude.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <span>🙏</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Journal</h1>
            <p className="text-lg text-gray-600">Reflect on your thoughts and track your journey</p>
          </div>
          <button
            onClick={() => setShowNewEntry(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90 gentle-hover flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Entry</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary mb-1">{entries.length}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">7</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl mb-1">😊</div>
            <div className="text-sm text-gray-600">Most Common Mood</div>
          </div>
        </div>

        {/* Entries Timeline */}
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800 mb-1">{entry.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="flex items-center space-x-1">
                      <span>{moodEmojis[entry.mood as keyof typeof moodEmojis]}</span>
                      <span className="capitalize">{entry.mood}</span>
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-primary">
                  →
                </button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {entry.content}
              </p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {entry.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{entry.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Start your journal</h3>
            <p className="text-gray-600 mb-6">Begin documenting your thoughts and feelings</p>
            <button
              onClick={() => setShowNewEntry(true)}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90"
            >
              Write Your First Entry
            </button>
          </div>
        )}
      </div>

      <NewEntryModal />
      <EntryDetailModal />
    </div>
  );
};

export default Journal;
