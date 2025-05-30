import React from 'react';
import { DetectionSettings } from '../types';
import { Sliders } from 'lucide-react';

interface SettingsPanelProps {
  settings: DetectionSettings;
  onSettingsChange: (settings: Partial<DetectionSettings>) => void;
  disabled?: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onSettingsChange, 
  disabled = false 
}) => {
  const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ sensitivity: parseInt(e.target.value) });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onSettingsChange({ [name]: checked });
  };
  
  const handleMinDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ minSegmentDuration: parseFloat(e.target.value) });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Sliders className="w-5 h-5 mr-2 text-blue-400" />
        Detection Settings
      </h2>
      
      <div>
        <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-400 mb-1">
          Detection Sensitivity ({settings.sensitivity}%)
        </label>
        <input 
          type="range" 
          id="sensitivity" 
          min="0" 
          max="100" 
          value={settings.sensitivity}
          onChange={handleSensitivityChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      <div>
        <label htmlFor="minDuration" className="block text-sm font-medium text-gray-400 mb-1">
          Minimum Segment Duration ({settings.minSegmentDuration}s)
        </label>
        <input 
          type="range" 
          id="minDuration" 
          min="0.1" 
          max="2" 
          step="0.1"
          value={settings.minSegmentDuration}
          onChange={handleMinDurationChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Short (0.1s)</span>
          <span>Long (2s)</span>
        </div>
      </div>
      
      <div>
        <label className="flex items-center text-sm font-medium text-gray-400 cursor-pointer">
          <input 
            type="checkbox" 
            name="filterNoise"
            checked={settings.filterNoise} 
            onChange={handleCheckboxChange}
            disabled={disabled}
            className="mr-2 disabled:opacity-50"
          />
          Filter background noise
        </label>
        <p className="text-xs text-gray-500 ml-5 mt-1">
          Removes low-confidence noise segments from results
        </p>
      </div>
      
      <div>
        <label className="flex items-center text-sm font-medium text-gray-400 cursor-pointer">
          <input 
            type="checkbox" 
            name="detectMultipleSpeakers"
            checked={settings.detectMultipleSpeakers} 
            onChange={handleCheckboxChange}
            disabled={disabled}
            className="mr-2 disabled:opacity-50"
          />
          Detect multiple speakers
        </label>
        <p className="text-xs text-gray-500 ml-5 mt-1">
          Attempts to identify different speakers in audio
        </p>
      </div>
      
      <div className="pt-2 text-xs text-gray-500 italic border-t border-gray-700 mt-2">
        <p>These settings simulate parameters that would be passed to a Python voice detection model</p>
      </div>
    </div>
  );
};

export default SettingsPanel;