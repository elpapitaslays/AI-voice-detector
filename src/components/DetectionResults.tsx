import React, { useState } from 'react';
import { VoiceResult } from '../types';
import DetailedSegmentView from './DetailedSegmentView';

interface DetectionResultsProps {
  results: VoiceResult[];
  confidence: number;
}

const DetectionResults: React.FC<DetectionResultsProps> = ({ results, confidence }) => {
  const [selectedSegment, setSelectedSegment] = useState<VoiceResult | null>(null);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
        <p>No voice detection results yet.</p>
        <p className="text-sm mt-2">Upload an audio file and run detection to see results.</p>
      </div>
    );
  }
  
  // Calculate statistics
  const speechSegments = results.filter(r => r.type === 'Speech').length;
  const noiseSegments = results.filter(r => r.type === 'Noise').length;
  const silenceSegments = results.filter(r => r.type === 'Silence').length;
  const musicSegments = results.filter(r => r.type === 'Music').length;
  
  // Calculate total duration
  const totalDuration = results.reduce((sum, r) => sum + (r.endTime - r.startTime), 0);
  
  // Calculate speech percentage
  const speechDuration = results
    .filter(r => r.type === 'Speech')
    .reduce((sum, r) => sum + (r.endTime - r.startTime), 0);
  const speechPercentage = Math.round((speechDuration / totalDuration) * 100);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-gray-900 rounded-lg p-3 flex-1 min-w-[140px]">
          <div className="text-sm text-gray-400">Overall Confidence</div>
          <div className="text-2xl font-semibold text-white mt-1">{confidence}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div 
              className={`h-2.5 rounded-full ${getConfidenceColor(confidence)}`} 
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-3 flex-1 min-w-[140px]">
          <div className="text-sm text-gray-400">Total Segments</div>
          <div className="text-2xl font-semibold text-white mt-1">{results.length}</div>
          <div className="flex mt-2 space-x-1">
            <div className="bg-blue-900 h-2 flex-grow rounded-sm" style={{ width: `${speechSegments / results.length * 100}%` }}></div>
            <div className="bg-red-900 h-2 flex-grow rounded-sm" style={{ width: `${noiseSegments / results.length * 100}%` }}></div>
            <div className="bg-gray-700 h-2 flex-grow rounded-sm" style={{ width: `${silenceSegments / results.length * 100}%` }}></div>
            <div className="bg-purple-900 h-2 flex-grow rounded-sm" style={{ width: `${musicSegments / results.length * 100}%` }}></div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-3 flex-1 min-w-[140px]">
          <div className="text-sm text-gray-400">Speech Content</div>
          <div className="text-2xl font-semibold text-white mt-1">{speechPercentage}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div 
              className="h-2.5 rounded-full bg-blue-500" 
              style={{ width: `${speechPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-auto max-h-[400px] pr-2">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Segment
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Start Time
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                End Time
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {results.map((result, index) => (
              <tr 
                key={index} 
                onClick={() => setSelectedSegment(result)}
                className="hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {index + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {formatTime(result.startTime)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {formatTime(result.endTime)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeClass(result.type)}`}>
                    {result.type}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-1.5 rounded-full ${getConfidenceColor(result.confidence)}`} 
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="text-gray-300">{result.confidence}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs pt-2 border-t border-gray-700 mt-2">
        <div className="flex items-center">
          <span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-1"></span>
          <span className="text-gray-400">Speech</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-1"></span>
          <span className="text-gray-400">Noise</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 inline-block rounded-full bg-gray-500 mr-1"></span>
          <span className="text-gray-400">Silence</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 inline-block rounded-full bg-purple-500 mr-1"></span>
          <span className="text-gray-400">Music</span>
        </div>
      </div>
      
      {selectedSegment && (
        <DetailedSegmentView 
          segment={selectedSegment} 
          onClose={() => setSelectedSegment(null)} 
        />
      )}
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

function getTypeClass(type: string): string {
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
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'bg-green-500';
  if (confidence >= 60) return 'bg-blue-500';
  if (confidence >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default DetectionResults;