import { useState, useCallback, useRef } from 'react';
import { simulateAudioProcessing } from '../utils/audioProcessing';
import { VoiceResult, DetectionSettings } from '../types';

export const useVoiceDetector = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<VoiceResult[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [settings, setSettings] = useState<DetectionSettings>({
    sensitivity: 75,
    filterNoise: true,
    detectMultipleSpeakers: true,
    minSegmentDuration: 0.5,
  });
  
  // Ref to cancel processing if needed
  const processingCancelRef = useRef<boolean>(false);
  
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      setAudioFile(files[0]);
      setResults([]);
      setConfidence(0);
    }
  }, []);
  
  const processAudio = useCallback(async () => {
    if (!audioFile) return;
    
    setIsProcessing(true);
    processingCancelRef.current = false;
    
    try {
      // In a real implementation, this would call a Python backend API
      // via fetch or similar mechanism. The Python API would process the audio
      // and return the results. Here we're simulating that behavior.
      
      // Simulate uploading to Python backend
      console.log('Uploading file to backend...'); 
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (processingCancelRef.current) return;
      console.log('Starting voice detection analysis...');
      
      // Simulated Python backend processing
      const { detectionResults, overallConfidence } = await simulateAudioProcessing(audioFile);
      
      if (processingCancelRef.current) return;
      console.log('Processing complete, received results');
      
      // Apply settings filters (this would normally happen server-side)
      const filteredResults = detectionResults
        // Filter by minimum duration
        .filter(result => (result.endTime - result.startTime) >= settings.minSegmentDuration)
        // Filter noise if enabled
        .filter(result => settings.filterNoise ? result.type !== 'Noise' || result.confidence > 60 : true);
      
      setResults(filteredResults);
      setConfidence(overallConfidence);
    } catch (error) {
      console.error('Error processing audio:', error);
      // Handle error - in a real app would show user-friendly error
    } finally {
      if (!processingCancelRef.current) {
        setIsProcessing(false);
      }
    }
  }, [audioFile, settings]);
  
  const cancelProcessing = useCallback(() => {
    processingCancelRef.current = true;
    setIsProcessing(false);
    // In a real implementation, would also abort the fetch request
  }, []);
  
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const updateSettings = useCallback((newSettings: Partial<DetectionSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const downloadResults = useCallback(() => {
    if (results.length === 0) return;
    
    const resultsJson = JSON.stringify({ 
      results, 
      confidence,
      filename: audioFile?.name,
      timestamp: new Date().toISOString(),
      settings
    }, null, 2);
    
    const blob = new Blob([resultsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `voice-detection-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }, [results, confidence, audioFile, settings]);
  
  return {
    audioFile,
    setAudioFile,
    isProcessing,
    isPlaying,
    results,
    confidence,
    settings,
    processAudio,
    cancelProcessing,
    togglePlayback,
    handleFileUpload,
    updateSettings,
    downloadResults
  };
};