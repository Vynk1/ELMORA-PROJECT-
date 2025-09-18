/**
 * Example: Enhanced Friends.tsx with React Bits Effects
 * 
 * This file demonstrates how to integrate the React Bits effects library
 * with accessibility-first design patterns in the Friends component.
 */

import React, { useState, Suspense, lazy } from 'react';
import { useReducedMotion } from '../utils/withReducedMotion';
import { useOnScreen } from '../hooks/useOnScreen';
import { loadEffect } from '../utils/loadEffect';

// Lazy load effects using the loadEffect utility
const DecryptText = loadEffect('DecryptText');
const TrueFocus = loadEffect('TrueFocus');
const ClickSpark = loadEffect('ClickSpark');

interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  compatibility: number;
  interests: string[];
}

const FriendsWithEffects: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<Set<string>>(new Set());
  const [skippedProfiles, setSkippedProfiles] = useState<Set<string>>(new Set());
  const prefersReducedMotion = useReducedMotion();

  // Sample data
  const suggestedFriends: Friend[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      mutualFriends: 3,
      compatibility: 92,
      interests: ['Meditation', 'Reading', 'Hiking']
    },
    {
      id: '2', 
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      mutualFriends: 7,
      compatibility: 87,
      interests: ['Fitness', 'Cooking', 'Photography']
    },
    {
      id: '3',
      name: 'Jamie Park',
      avatar: '/avatars/jamie.jpg', 
      mutualFriends: 2,
      compatibility: 94,
      interests: ['Art', 'Music', 'Travel']
    }
  ];

  const handleSendFriendRequest = (friendId: string) => {
    setFriendRequests(prev => new Set([...prev, friendId]));
  };

  const handleSkipProfile = (friendId: string) => {
    setSkippedProfiles(prev => new Set([...prev, friendId]));
  };

  const FriendCard: React.FC<{ friend: Friend }> = ({ friend }) => {
    const [cardRef, isVisible] = useOnScreen({ threshold: 0.2, triggerOnce: true });
    const isRequestSent = friendRequests.has(friend.id);
    const isSkipped = skippedProfiles.has(friend.id);

    if (isSkipped) return null;

    return (
      <div 
        ref={cardRef}
        className={`
          bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* Profile Header with DecryptText name reveal */}
        <div className="text-center mb-4">
          <img
            src={friend.avatar}
            alt={`${friend.name}'s profile`}
            className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-primary/10"
          />
          
          <Suspense fallback={<h3 className="font-semibold text-lg text-gray-800">{friend.name}</h3>}>
            <DecryptText
              text={friend.name}
              speed={50}
              disabled={prefersReducedMotion}
              className="font-semibold text-lg text-gray-800 block"
            />
          </Suspense>
          
          <p className="text-gray-600 text-sm">
            {friend.mutualFriends} mutual friends • {friend.compatibility}% match
          </p>
        </div>

        {/* Interests with subtle animation */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 font-medium mb-2">Shared interests:</p>
          <div className="flex flex-wrap gap-2">
            {friend.interests.map((interest, index) => (
              <span
                key={interest}
                className={`
                  text-xs bg-primary/10 text-primary px-3 py-1 rounded-full transition-all duration-300
                  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                style={{ 
                  transitionDelay: prefersReducedMotion ? '0ms' : `${index * 100}ms` 
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons with Enhanced Effects */}
        <div className="flex gap-3">
          <Suspense 
            fallback={
              <button className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl font-medium cursor-not-allowed">
                Skip
              </button>
            }
          >
            <ClickSpark
              color="rgba(107, 114, 128, 0.5)"
              size={12}
              disabled={prefersReducedMotion}
            >
              <button
                onClick={() => handleSkipProfile(friend.id)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                aria-label={`Skip ${friend.name}'s profile`}
              >
                Skip
              </button>
            </ClickSpark>
          </Suspense>

          <Suspense
            fallback={
              <button className="flex-1 bg-primary text-white py-3 rounded-xl font-medium">
                {isRequestSent ? 'Request Sent!' : 'Send Friend Request'}
              </button>
            }
          >
            {isRequestSent ? (
              <TrueFocus
                scale={1.05}
                glowColor="rgba(34, 197, 94, 0.3)"
                disabled={prefersReducedMotion}
              >
                <button
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-green-200"
                  disabled
                  aria-label={`Friend request sent to ${friend.name}`}
                >
                  ✓ Request Sent!
                </button>
              </TrueFocus>
            ) : (
              <ClickSpark
                color="rgba(79, 70, 229, 0.8)"
                size={16}
                disabled={prefersReducedMotion}
              >
                <button
                  onClick={() => handleSendFriendRequest(friend.id)}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20"
                  aria-label={`Send friend request to ${friend.name}`}
                >
                  Send Friend Request
                </button>
              </ClickSpark>
            )}
          </Suspense>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Suspense fallback={<h1 className="text-3xl font-light text-gray-800 mb-2">Find Friends</h1>}>
            <DecryptText
              text="Find Friends"
              speed={30}
              disabled={prefersReducedMotion}
              className="text-3xl font-light text-gray-800 mb-2 block"
            />
          </Suspense>
          <p className="text-gray-600">
            Connect with people who share your interests and goals
          </p>
        </div>

        {/* Friend Suggestions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>

        {/* Empty State (when no more suggestions) */}
        {suggestedFriends.every(f => 
          friendRequests.has(f.id) || skippedProfiles.has(f.id)
        ) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <Suspense fallback={<h2 className="text-xl font-medium text-gray-700 mb-2">All caught up!</h2>}>
              <DecryptText
                text="All caught up!"
                speed={25}
                disabled={prefersReducedMotion}
                className="text-xl font-medium text-gray-700 mb-2 block"
              />
            </Suspense>
            <p className="text-gray-500">
              You've reviewed all available friend suggestions. 
              Check back later for more!
            </p>
          </div>
        )}

        {/* Accessibility Notice */}
        {prefersReducedMotion && (
          <div 
            className="fixed bottom-4 right-4 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm border border-blue-200"
            role="status"
            aria-live="polite"
          >
            ♿ Reduced motion mode active
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsWithEffects;