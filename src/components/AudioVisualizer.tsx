import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioVisualizerProps {
  audioFile: File | null;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioFile, isPlaying }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  useEffect(() => {
    if (containerRef.current && !wavesurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#4f76c7',
        progressColor: '#2563eb',
        cursorColor: '#f97316',
        cursorWidth: 2,
        height: 100,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        normalize: true,
        responsive: true,
      });
      
      wavesurferRef.current = wavesurfer;
      
      return () => {
        wavesurfer.destroy();
        wavesurferRef.current = null;
      };
    }
  }, []);
  
  useEffect(() => {
    if (audioFile && wavesurferRef.current) {
      const fileURL = URL.createObjectURL(audioFile);
      wavesurferRef.current.load(fileURL);
      
      return () => {
        URL.revokeObjectURL(fileURL);
      };
    }
  }, [audioFile]);
  
  useEffect(() => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.play();
      } else {
        wavesurferRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  return (
    <div className="rounded-lg bg-gray-900 p-4">
      <div 
        ref={containerRef} 
        className={`h-[100px] ${!audioFile ? 'flex items-center justify-center text-gray-500' : ''}`}
      >
        {!audioFile && "Upload an audio file to visualize waveform"}
      </div>
    </div>
  );
};

export default AudioVisualizer;