import React, { useState } from 'react';
import { Mic, Upload, Play, Square, Download, Wand2, X } from 'lucide-react';
import AudioVisualizer from './components/AudioVisualizer';
import DetectionResults from './components/DetectionResults';
import SettingsPanel from './components/SettingsPanel';
import { useVoiceDetector } from './hooks/useVoiceDetector';

function App() {
  const { 
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
  } = useVoiceDetector();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Mic className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold">Voice Detector AI</h1>
          </div>
          <div className="ml-auto text-sm text-gray-400">
            Python + React Implementation
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-400" />
              Audio Input
            </h2>
            
            <div className="mb-6">
              {audioFile ? (
                <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-900">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 bg-opacity-20 rounded-full">
                      <Mic className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">{audioFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button 
                    className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                    onClick={() => setAudioFile(null)}
                    disabled={isProcessing}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label 
                  htmlFor="audio-upload" 
                  className="block w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <span className="block mb-2 text-gray-400">
                    Upload an audio file (.mp3, .wav)
                  </span>
                  <span className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors">
                    Select File
                  </span>
                  <input 
                    id="audio-upload" 
                    type="file"
                    accept="audio/*" 
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </label>
              )}
            </div>
            
            <AudioVisualizer audioFile={audioFile} isPlaying={isPlaying} />
            
            <div className="flex flex-wrap gap-3 mt-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={togglePlayback}
                disabled={!audioFile || isProcessing}
              >
                {isPlaying ? <Square size={16} /> : <Play size={16} />}
                {isPlaying ? 'Stop' : 'Play'}
              </button>
              
              {!isProcessing ? (
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={processAudio}
                  disabled={!audioFile || isProcessing}
                >
                  <Wand2 size={16} />
                  Detect Voice
                </button>
              ) : (
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                  onClick={cancelProcessing}
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
              
              {results.length > 0 && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded transition-colors ml-auto"
                  onClick={downloadResults}
                >
                  <Download size={16} />
                  Export Results
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex-grow">
            <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
            <DetectionResults results={results} confidence={confidence} />
          </div>
        </div>
        
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <SettingsPanel 
              settings={settings}
              onSettingsChange={updateSettings}
              disabled={isProcessing}
            />
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-300 text-sm">
              <p>
                This voice detector uses AI to analyze audio files and detect human speech.
                It processes the audio data through multiple detection stages:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Audio preprocessing and noise filtering</li>
                <li>Voice activity detection to identify speech segments</li>
                <li>Feature extraction from audio waveforms</li>
                <li>Machine learning classification of speech patterns</li>
                <li>Confidence scoring and results visualization</li>
              </ol>
              <div className="mt-4 p-3 border border-blue-900 bg-blue-900 bg-opacity-20 rounded-md">
                <h3 className="text-sm font-medium text-blue-400 mb-1">Technical Implementation</h3>
                <p className="text-xs text-gray-400">
                  In a production environment, this application would use a Python backend with
                  libraries such as librosa, numpy, scipy, and tensorflow/pytorch for audio
                  analysis and machine learning classification. The frontend would communicate
                  with this backend via API calls to process uploaded audio files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          Voice Detector AI - Built with Python, React and TailwindCSS
        </div>
      </footer>
    </div>
  );
}

export default App;