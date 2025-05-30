import React from 'react';
import { VoiceResult } from '../types';

interface DetailedSegmentViewProps {
  segment: VoiceResult | null;
  onClose: () => void;
}

const DetailedSegmentView: React.FC<DetailedSegmentViewProps> = ({ segment, onClose }) => {
  if (!segment) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Speech':
        return 'bg-blue-900 text-blue-200';
      case 'Silence':
        return 'bg-gray-700 text-gray-300';
      case 'Noise':
        return 'bg-red-900 text-red-200';
      case 'Music':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Segment Detail</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            ✕
          </button>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Segment Type</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs ${getTypeColor(segment.type)}`}>
              {segment.type}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Time Range</span>
            <span className="text-sm text-gray-200">
              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
              <span className="text-gray-400 ml-2">
                ({(segment.endTime - segment.startTime).toFixed(2)}s)
              </span>
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Confidence</span>
              <span className="text-sm text-gray-400">{segment.confidence}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getConfidenceColorClass(segment.confidence)}`} 
                style={{ width: `${segment.confidence}%` }}
              />
            </div>
          </div>
          
          {segment.metadata && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Technical Details</h4>
              <div className="bg-gray-900 rounded-lg p-3 space-y-2 text-sm">
                {Object.entries(segment.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              <span className="font-medium">Analysis Note: </span>
              {getAnalysisNote(segment)}
            </p>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function getConfidenceColorClass(confidence: number): string {
  if (confidence >= 80) return 'bg-green-500';
  if (confidence >= 60) return 'bg-blue-500';
  if (confidence >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getAnalysisNote(segment: VoiceResult): string {
  switch (segment.type) {
    case 'Speech':
      if (segment.confidence >= 80) {
        return 'High confidence human speech detected. Clear vocal patterns with minimal interference.';
      } else if (segment.confidence >= 60) {
        return 'Moderate confidence in speech detection. Some background noise may be present.';
      } else {
        return 'Low confidence speech detection. High noise or distant speaker possible.';
      }
    case 'Silence':
      return 'Ambient silence or background level noise below threshold for speech detection.';
    case 'Noise':
      return 'Non-speech audio detected. May include mechanical sounds, environmental noise, or overlapping sounds.';
    case 'Music':
      return 'Musical patterns detected. Rhythmic and tonal features distinct from speech patterns.';
    default:
      return 'Analysis unavailable for this segment type.';
  }
}

export default DetailedSegmentView;