import React, { useState, lazy, Suspense, useEffect } from 'react';
import VoiceJournal from '../components/VoiceJournal';
import { getJournals, addJournal, deleteJournal } from '../lib/supabaseApi';
import { Zap, Smile, CloudSun, Meh, MessageCircle, Frown, Annoyed, Lightbulb, Mic, BookOpen, X, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';

// Lazy load effect components
const TextCursor = lazy(() => import('../components/effects/TextCursor'));
const DecryptedText = lazy(() => import('../components/effects/DecryptedText'));
const FallingText = lazy(() => import('../components/effects/FallingText'));
const TextTrail = lazy(() => import('../components/effects/TextTrail'));
const CountUp = lazy(() => import('../components/effects/CountUp'));
const ScrollReveal = lazy(() => import('../components/effects/ScrollReveal'));

interface JournalEntry {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  mood?: string;
  title?: string;
  tags?: string[];
  gratitude?: string[];
  aiSummary?: string;
}

const Journal: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showAISummary, setShowAISummary] = useState<{[key: string]: boolean}>({});
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Load journal entries from Supabase
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJournals();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const moodIcons = {
    'amazing': Zap,
    'happy': Smile,
    'content': CloudSun,
    'neutral': Meh,
    'reflective': MessageCircle,
    'sad': Frown,
    'anxious': CloudSun,
    'frustrated': Annoyed
  };

  const NewEntryModal = () => {
    const [newEntry, setNewEntry] = useState({
      mood: 'neutral',
      title: '',
      content: '',
      tags: '',
      gratitude: ''
    });

    const handleSubmit = async () => {
      if (!newEntry.content.trim()) return;
      
      setSaving(true);
      try {
        // Create journal content with optional title and metadata
        let journalContent = newEntry.content.trim();
        
        if (newEntry.title.trim()) {
          journalContent = `**${newEntry.title.trim()}**\n\n${journalContent}`;
        }
        
        if (newEntry.mood !== 'neutral') {
          journalContent = `Mood: ${newEntry.mood}\n${journalContent}`;
        }
        
        if (newEntry.gratitude.trim()) {
          const gratitudeItems = newEntry.gratitude.split(',').map(item => item.trim()).filter(item => item);
          if (gratitudeItems.length > 0) {
            journalContent += `\n\n**Grateful for:**\n${gratitudeItems.map(item => `• ${item}`).join('\n')}`;
          }
        }
        
        if (newEntry.tags.trim()) {
          const tags = newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          if (tags.length > 0) {
            journalContent += `\n\n#${tags.join(' #')}`;
          }
        }
        
        const savedEntry = await addJournal(journalContent);
        setEntries([savedEntry, ...entries]);
        setShowNewEntry(false);
        setNewEntry({ mood: 'neutral', title: '', content: '', tags: '', gratitude: '' });
        
        // Show saved confirmation
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 2000);
      } catch (err) {
        console.error('Failed to save journal entry:', err);
        alert(err instanceof Error ? err.message : 'Failed to save journal entry');
      } finally {
        setSaving(false);
      }
    };
    
    const [saving, setSaving] = useState(false);

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
                {Object.entries(moodIcons).map(([mood, IconComponent]) => (
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
                    <IconComponent className="w-6 h-6 mx-auto mb-1" strokeWidth={2} />
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
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Journal Content</label>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" strokeWidth={2} />
                  <span>Try voice journaling! Click the</span>
                  <Mic className="w-3 h-3" strokeWidth={2} />
                  <span>button</span>
                </div>
              </div>
              
              <VoiceJournal
                initialText={newEntry.content}
                onTranscriptChange={(text) => setNewEntry({...newEntry, content: text})}
                placeholder="Write about your day, thoughts, feelings... or click the microphone to speak your thoughts!"
                className="voice-journal-entry"
              />
            </div>
            
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
              disabled={saving || !newEntry.content.trim()}
              className="flex-1 py-3 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Entry'}
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
              <h3 className="text-2xl font-light text-gray-800 mb-2">
                {selectedEntry.title || 'Journal Entry'}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{new Date(selectedEntry.created_at).toLocaleDateString()}</span>
                {selectedEntry.mood && (
                  <span className="flex items-center space-x-1">
                    {React.createElement(moodIcons[selectedEntry.mood as keyof typeof moodIcons] || Meh, {
                      className: "w-4 h-4",
                      strokeWidth: 2
                    })}
                    <span className="capitalize">{selectedEntry.mood}</span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          <div className="prose prose-gray max-w-none mb-6">
            <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
          </div>

          {selectedEntry.tags && selectedEntry.tags.length > 0 && (
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
            <div className="mb-6">
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

          {/* AI Summary Section */}
          {selectedEntry.aiSummary && (
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700">AI Insights</h4>
                <button
                  onClick={() => setShowAISummary(prev => ({
                    ...prev,
                    [selectedEntry.id]: !prev[selectedEntry.id]
                  }))}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {showAISummary[selectedEntry.id] ? 'Hide' : 'Show'} Insights
                </button>
              </div>
              
              {showAISummary[selectedEntry.id] && (
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <span className="text-2xl">🤖</span>
                    <div className="text-sm font-medium text-blue-800">AI Reflection</div>
                  </div>
                  
                  <Suspense fallback={
                    <p className="text-sm text-blue-700 leading-relaxed">
                      {selectedEntry.aiSummary}
                    </p>
                  }>
                    <DecryptedText 
                      text={selectedEntry.aiSummary}
                      speed={30}
                      className="text-sm text-blue-700 leading-relaxed"
                      disabled={prefersReducedMotion}
                    />
                  </Suspense>
                </div>
              )}
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

        {/* Enhanced Stats with CountUp */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Suspense fallback={
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary mb-1">{entries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
          }>
            <ScrollReveal duration={0.5} delay={0.1} disabled={prefersReducedMotion}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1" aria-live="polite">
                  <CountUp end={entries.length} duration={1000} disabled={prefersReducedMotion} />
                </div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
            </ScrollReveal>
          </Suspense>
          
          <Suspense fallback={
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {entries.filter(e => new Date(e.created_at).getMonth() === new Date().getMonth()).length}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          }>
            <ScrollReveal duration={0.5} delay={0.2} disabled={prefersReducedMotion}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1" aria-live="polite">
                  <CountUp 
                    end={entries.filter(e => new Date(e.created_at).getMonth() === new Date().getMonth()).length} 
                    duration={1200} 
                    disabled={prefersReducedMotion} 
                  />
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </ScrollReveal>
          </Suspense>
          
          <Suspense fallback={
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          }>
            <ScrollReveal duration={0.5} delay={0.3} disabled={prefersReducedMotion}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1" aria-live="polite">
                  <CountUp end={7} duration={800} disabled={prefersReducedMotion} />
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </ScrollReveal>
          </Suspense>
          
          <Suspense fallback={
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl mb-1">😊</div>
              <div className="text-sm text-gray-600">Most Common Mood</div>
            </div>
          }>
            <ScrollReveal duration={0.5} delay={0.4} disabled={prefersReducedMotion}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-2xl mb-1">😊</div>
                <div className="text-sm text-gray-600">Most Common Mood</div>
              </div>
            </ScrollReveal>
          </Suspense>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading journal entries...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" strokeWidth={2} />
              <span className="font-medium">Failed to load journal entries</span>
            </div>
            <p className="text-red-600 text-sm mt-2">{error}</p>
            <button
              onClick={loadEntries}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Entries Timeline */}
        {!loading && !error && (
          <div className="space-y-6">
            {entries.map((entry) => {
              // Parse content to extract title, mood, etc. if formatted
              const lines = entry.content.split('\n');
              const firstLine = lines[0];
              const isTitle = firstLine.startsWith('**') && firstLine.endsWith('**');
              const title = isTitle ? firstLine.replace(/\*\*/g, '') : 'Journal Entry';
              const content = isTitle ? lines.slice(2).join('\n') : entry.content;
              
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry({ ...entry, title })}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        {entry.mood && (
                          <span className="flex items-center space-x-1">
                            {React.createElement(moodIcons[entry.mood as keyof typeof moodIcons] || Meh, {
                              className: "w-4 h-4",
                              strokeWidth: 2
                            })}
                            <span className="capitalize">{entry.mood}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 hover:text-primary" strokeWidth={2} />
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {content.length > 150 ? `${content.substring(0, 150)}...` : content}
                  </p>

                  {entry.tags && entry.tags.length > 0 && (
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
              );
            })}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-12 relative">
            {/* Spline Notebook Scene Placeholder */}
            <div 
              id="spline-journal-placeholder" 
              data-spline="notebook-petals"
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 pointer-events-none opacity-60"
            >
              {/* Reserved slot for Spline 3D notebook with petals */}
            </div>
            
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" strokeWidth={2} />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Start your journal</h3>
            <div className="text-gray-600 mb-6">
              <Suspense fallback="No entries yet — write one thing you're grateful for.">
                <TextCursor 
                  text="No entries yet — write one thing you're grateful for." 
                  speed={50} 
                  disabled={prefersReducedMotion}
                  className="text-gray-600"
                />
              </Suspense>
            </div>
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
      
      {/* Saved Entry Confirmation */}
      {showSavedMessage && !prefersReducedMotion && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <Suspense fallback={null}>
            <FallingText 
              trigger={showSavedMessage} 
              duration={1.8} 
              className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-medium"
            >
              <span className="flex items-center gap-1">
                Saved — well done!
                <Sparkles className="w-4 h-4" strokeWidth={2} />
              </span>
            </FallingText>
          </Suspense>
        </div>
      )}
      
      {/* Static saved message for reduced motion */}
      {showSavedMessage && prefersReducedMotion && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-medium flex items-center gap-1">
            Saved — well done!
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
