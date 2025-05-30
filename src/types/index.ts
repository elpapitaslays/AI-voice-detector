export interface VoiceResult {
  startTime: number;
  endTime: number;
  type: 'Speech' | 'Silence' | 'Noise' | 'Music';
  confidence: number;
  metadata?: {
    frequencyRange?: string;
    amplitude?: string;
    snr?: string;
    [key: string]: any;
  }
}

export interface AudioProcessingResult {
  detectionResults: VoiceResult[];
  overallConfidence: number;
}

export interface DetectionSettings {
  sensitivity: number;
  filterNoise: boolean;
  detectMultipleSpeakers: boolean;
  minSegmentDuration: number;
}