import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceRecordingProps {
  onTranscriptionUpdate?: (transcript: string) => void;
  onTranscriptionComplete?: (finalTranscript: string) => void;
  onError?: (error: string) => void;
}

interface VoiceRecordingState {
  isRecording: boolean;
  isSupported: boolean;
  hasPermission: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isLoading: boolean;
}

const useVoiceRecording = ({
  onTranscriptionUpdate,
  onTranscriptionComplete,
  onError
}: UseVoiceRecordingProps = {}) => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isSupported: false,
    hasPermission: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    isLoading: false
  });

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for browser support on mount
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    const isSupported = !!(SpeechRecognition || navigator.mediaDevices?.getUserMedia);

    setState(prev => ({ ...prev, isSupported }));

    if (SpeechRecognition) {
      // Use Web Speech API for real-time transcription (Chrome, Safari)
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isRecording: true, isLoading: false, error: null }));
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setState(prev => ({
          ...prev,
          transcript: prev.transcript + finalTranscript,
          interimTranscript
        }));

        if (finalTranscript) {
          onTranscriptionUpdate?.(prev => prev.transcript + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        let errorMessage = '';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
            break;
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
          case 'aborted':
            // Don't show error for intentional aborts
            setState(prev => ({ ...prev, isRecording: false, isLoading: false }));
            return;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setState(prev => ({ 
          ...prev, 
          error: errorMessage, 
          isRecording: false, 
          isLoading: false 
        }));
        onError?.(errorMessage);
      };

      recognition.onend = () => {
        setState(prev => ({ 
          ...prev, 
          isRecording: false,
          isLoading: false,
          interimTranscript: ''
        }));
        
        // Use the latest state from closure
        setState(prev => {
          if (prev.transcript) {
            onTranscriptionComplete?.(prev.transcript);
          }
          return prev;
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      setState(prev => ({ ...prev, hasPermission: true, error: null }));
      
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error: any) {
      const errorMessage = error.name === 'NotAllowedError' 
        ? 'Microphone permission denied. Please allow microphone access and try again.'
        : `Failed to access microphone: ${error.message}`;
      
      setState(prev => ({ ...prev, hasPermission: false, error: errorMessage }));
      onError?.(errorMessage);
      return false;
    }
  }, [onError]);

  const startRecording = useCallback(async () => {
    // Don't start if already recording
    if (state.isRecording) {
      console.warn('Recording already in progress');
      return;
    }

    if (!state.isSupported) {
      const error = 'Speech recognition is not supported in this browser';
      setState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    if (!state.hasPermission) {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        transcript: '', 
        interimTranscript: '',
        error: null 
      }));

      if (recognitionRef.current) {
        // Stop any existing recognition first
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
        
        // Small delay to ensure cleanup
        setTimeout(() => {
          try {
            // Use Web Speech API (Chrome, Safari, Edge)
            recognitionRef.current.start();
          } catch (startError: any) {
            const errorMessage = `Failed to start recording: ${startError.message}`;
            setState(prev => ({ ...prev, error: errorMessage, isLoading: false, isRecording: false }));
            onError?.(errorMessage);
          }
        }, 100);
      } else {
        // Fallback: Use MediaRecorder for other browsers
        await startMediaRecorderFallback();
      }
    } catch (error: any) {
      const errorMessage = `Failed to start recording: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false, isRecording: false }));
      onError?.(errorMessage);
    }
  }, [state.isSupported, state.hasPermission, state.isRecording, requestPermission, onError]);

  const startMediaRecorderFallback = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        await sendAudioToServer(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setState(prev => ({ ...prev, isRecording: true, isLoading: false }));

    } catch (error: any) {
      const errorMessage = `MediaRecorder fallback failed: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      onError?.(errorMessage);
    }
  }, [onError]);

  const sendAudioToServer = useCallback(async (audioBlob: Blob) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-note.webm');

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.transcript) {
        setState(prev => ({ 
          ...prev, 
          transcript: data.transcript,
          isLoading: false
        }));
        onTranscriptionComplete?.(data.transcript);
      } else {
        throw new Error(data.error || 'Failed to transcribe audio');
      }
    } catch (error: any) {
      const errorMessage = `Transcription failed: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      onError?.(errorMessage);
    }
  }, [onTranscriptionComplete, onError]);

  const stopRecording = useCallback(() => {
    try {
      if (recognitionRef.current && state.isRecording) {
        recognitionRef.current.stop();
      }

      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stop();
      }

      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
        streamRef.current = null;
      }

      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isLoading: false,
        interimTranscript: ''
      }));
    } catch (error: any) {
      console.warn('Error stopping recording:', error);
      // Force state reset even if there was an error
      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isLoading: false,
        interimTranscript: '',
        error: `Error stopping recording: ${error.message}`
      }));
    }
  }, [state.isRecording]);

  const clearTranscript = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      transcript: '', 
      interimTranscript: '', 
      error: null 
    }));
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetRecognition = useCallback(() => {
    try {
      // Stop and clean up everything
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
        streamRef.current = null;
      }

      setState(prev => ({
        ...prev,
        isRecording: false,
        isLoading: false,
        transcript: '',
        interimTranscript: '',
        error: null
      }));
    } catch (error) {
      console.warn('Error resetting recognition:', error);
      // Force state reset
      setState(prev => ({
        ...prev,
        isRecording: false,
        isLoading: false,
        error: null
      }));
    }
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    clearTranscript,
    resetError,
    resetRecognition,
    requestPermission,
  };
};

export default useVoiceRecording;