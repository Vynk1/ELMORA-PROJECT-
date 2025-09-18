import React, { useState, useEffect } from 'react';
import useVoiceRecording from '../hooks/useVoiceRecording';

interface VoiceJournalProps {
  onTranscriptChange?: (text: string) => void;
  initialText?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const VoiceJournal: React.FC<VoiceJournalProps> = ({
  onTranscriptChange,
  initialText = '',
  placeholder = 'Start speaking to add your thoughts...',
  className = '',
  disabled = false
}) => {
  const [text, setText] = useState(initialText);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const voiceRecording = useVoiceRecording({
    onTranscriptionUpdate: (transcript) => {
      const newText = text + ' ' + transcript;
      setText(newText.trim());
      onTranscriptChange?.(newText.trim());
    },
    onTranscriptionComplete: (transcript) => {
      const newText = text + ' ' + transcript;
      setText(newText.trim());
      onTranscriptChange?.(newText.trim());
    },
    onError: (error) => {
      console.error('Voice recording error:', error);
    }
  });

  // Update text when initialText changes
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleStartRecording = async () => {
    if (!voiceRecording.isSupported) {
      alert('Voice recording is not supported in this browser. Please use Chrome, Safari, or Edge.');
      return;
    }

    if (!voiceRecording.hasPermission) {
      setShowPermissionPrompt(true);
    }

    setAnimationClass('scale-110');
    setTimeout(() => setAnimationClass(''), 200);

    await voiceRecording.startRecording();
  };

  const handleStopRecording = () => {
    voiceRecording.stopRecording();
    setAnimationClass('scale-95');
    setTimeout(() => setAnimationClass(''), 200);
  };

  const handlePermissionRequest = async () => {
    const granted = await voiceRecording.requestPermission();
    if (granted) {
      setShowPermissionPrompt(false);
      await voiceRecording.startRecording();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTranscriptChange?.(newText);
  };

  const clearText = () => {
    setText('');
    onTranscriptChange?.('');
    voiceRecording.clearTranscript();
  };

  const getDisplayText = () => {
    if (voiceRecording.interimTranscript) {
      return text + ' ' + voiceRecording.interimTranscript;
    }
    return text;
  };

  const getMicrophoneButtonClass = () => {
    let baseClass = `
      relative w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium
      transition-all duration-200 transform ${animationClass}
    `;

    if (disabled) {
      return baseClass + ' bg-gray-300 text-gray-500 cursor-not-allowed';
    }

    if (voiceRecording.isRecording) {
      return baseClass + ' bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse cursor-pointer';
    }

    if (voiceRecording.isLoading) {
      return baseClass + ' bg-yellow-500 text-white cursor-wait';
    }

    return baseClass + ' bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg cursor-pointer';
  };

  const getMicrophoneIcon = () => {
    if (voiceRecording.isLoading) {
      return '⏳';
    }
    if (voiceRecording.isRecording) {
      return '🔴';
    }
    return '🎤';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Text Area */}
      <div className="relative">
        <textarea
          value={getDisplayText()}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled || voiceRecording.isRecording}
          className={`
            w-full p-4 pr-20 border border-gray-200 rounded-2xl h-40 resize-none 
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${voiceRecording.isRecording ? 'bg-blue-50 border-blue-200' : 'bg-white'}
            ${voiceRecording.interimTranscript ? 'text-gray-700' : ''}
            transition-colors duration-200
          `}
        />
        
        {/* Interim transcript indicator */}
        {voiceRecording.interimTranscript && (
          <div className="absolute bottom-2 left-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            Speaking...
          </div>
        )}

        {/* Voice Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* Microphone Button */}
          <button
            type="button"
            onClick={voiceRecording.isRecording ? handleStopRecording : handleStartRecording}
            disabled={disabled}
            className={getMicrophoneButtonClass()}
            title={voiceRecording.isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {getMicrophoneIcon()}
            
            {/* Recording pulse animation */}
            {voiceRecording.isRecording && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
            )}
          </button>

          {/* Clear Button */}
          {text && (
            <button
              type="button"
              onClick={clearText}
              disabled={disabled || voiceRecording.isRecording}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm flex items-center justify-center transition-colors"
              title="Clear text"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Status and Error Messages */}
      <div className="mt-2 space-y-1">
        {voiceRecording.isRecording && (
          <div className="text-sm text-blue-600 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Listening... Speak clearly and naturally</span>
          </div>
        )}

        {voiceRecording.isLoading && (
          <div className="text-sm text-yellow-600 flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
            <span>Processing your speech...</span>
          </div>
        )}

        {voiceRecording.error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center justify-between">
            <span>{voiceRecording.error}</span>
            <div className="flex space-x-2">
              <button
                onClick={voiceRecording.resetRecognition}
                className="text-red-400 hover:text-red-600 text-xs underline"
                title="Reset voice recognition"
              >
                Reset
              </button>
              <button
                onClick={voiceRecording.resetError}
                className="text-red-400 hover:text-red-600 font-bold text-lg"
                title="Dismiss error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {!voiceRecording.isSupported && (
          <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-2">
            Voice recording is not supported in this browser. For the best experience, please use Chrome, Safari, or Edge.
          </div>
        )}
      </div>

      {/* Permission Prompt Modal */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Microphone Permission Required
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                We need access to your microphone to convert your speech to text. 
                Your audio is processed securely and never stored.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPermissionPrompt(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePermissionRequest}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Allow Microphone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      {!voiceRecording.hasPermission && !showPermissionPrompt && (
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
          <span>💡</span>
          <span>Tip: Click the microphone button to start voice journaling</span>
        </div>
      )}
    </div>
  );
};

export default VoiceJournal;