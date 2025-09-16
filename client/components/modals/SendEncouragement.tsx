import React, { useState } from 'react';

interface SendEncouragementProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { recipient: string; message: string; template?: string }) => void;
}

const SendEncouragement: React.FC<SendEncouragementProps> = ({ isOpen, onClose, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const encouragementTemplates = [
    {
      id: 'strength',
      title: 'You are stronger than you think',
      message: "Hey! 💪 Just wanted to remind you that you're incredibly strong and capable. Every challenge you've overcome has made you who you are today. Keep going!",
      emoji: '💪'
    },
    {
      id: 'progress',
      title: 'Celebrating your progress',
      message: "🌟 I've been thinking about how much you've grown lately. Every small step counts, and you're doing amazing. I believe in you!",
      emoji: '🌟'
    },
    {
      id: 'support',
      title: 'You are not alone',
      message: "🤗 Remember that you're never alone in this journey. I'm here for you, and together we can get through anything. Sending you love and support!",
      emoji: '🤗'
    },
    {
      id: 'motivation',
      title: 'Keep pushing forward',
      message: "🚀 You've got this! Sometimes the path gets tough, but that's when we discover just how amazing we really are. Keep pushing forward!",
      emoji: '🚀'
    },
    {
      id: 'gratitude',
      title: 'Grateful for you',
      message: "🙏 I'm so grateful to have you in my life. Your kindness and resilience inspire me every day. Thank you for being you!",
      emoji: '🙏'
    },
    {
      id: 'hope',
      title: 'Tomorrow is a new day',
      message: "🌅 Whatever you're going through right now, remember that tomorrow brings new possibilities. You have so much to offer the world!",
      emoji: '🌅'
    }
  ];

  const friends = [
    { id: 'sarah', name: 'Sarah M.', status: 'online' },
    { id: 'mike', name: 'Mike R.', status: 'away' },
    { id: 'emma', name: 'Emma L.', status: 'online' },
    { id: 'alex', name: 'Alex P.', status: 'offline' },
    { id: 'random', name: 'Random Friend in Need', status: 'special' }
  ];

  const handleSend = () => {
    const message = selectedTemplate 
      ? encouragementTemplates.find(t => t.id === selectedTemplate)?.message || ''
      : customMessage;

    if (recipient && message.trim()) {
      onSend({
        recipient,
        message: message.trim(),
        template: selectedTemplate || undefined
      });
      onClose();
      // Reset form
      setRecipient('');
      setCustomMessage('');
      setSelectedTemplate('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-800 mb-2">Send Encouragement</h2>
          <p className="text-gray-600">Spread some positivity today!</p>
        </div>

        {/* Recipient Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Send to
          </label>
          <div className="space-y-2">
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setRecipient(friend.id)}
                className={`
                  w-full p-3 rounded-2xl text-left flex items-center space-x-3 transition-all
                  ${recipient === friend.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                <div className={`
                  w-3 h-3 rounded-full
                  ${friend.status === 'online' ? 'bg-green-500' :
                    friend.status === 'away' ? 'bg-yellow-500' :
                    friend.status === 'special' ? 'bg-purple-500' : 'bg-gray-400'
                  }
                `} />
                <span>{friend.name}</span>
                {friend.status === 'special' && <span className="text-xs opacity-75">✨</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Message Templates */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose a template or write your own
          </label>
          <div className="grid gap-3 mb-4">
            {encouragementTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setCustomMessage('');
                }}
                className={`
                  p-4 rounded-2xl text-left transition-all
                  ${selectedTemplate === template.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{template.emoji}</span>
                  <div>
                    <div className="font-medium text-sm mb-1">{template.title}</div>
                    <div className="text-xs opacity-90 line-clamp-2">{template.message}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Message */}
          <div className="relative">
            <textarea
              value={customMessage}
              onChange={(e) => {
                setCustomMessage(e.target.value);
                if (e.target.value) setSelectedTemplate('');
              }}
              placeholder="Or write your own encouraging message..."
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Preview */}
        {(selectedTemplate || customMessage) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
            <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
            <div className="text-sm text-gray-600">
              {selectedTemplate 
                ? encouragementTemplates.find(t => t.id === selectedTemplate)?.message
                : customMessage
              }
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!recipient || (!selectedTemplate && !customMessage.trim())}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendEncouragement;
