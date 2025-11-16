import { ApiConfiguration } from '@/types/admin';

interface VoiceConfigurationProps {
  configuration: ApiConfiguration;
  isEditing: boolean;
  onChange: (config: ApiConfiguration) => void;
}

export const VoiceConfiguration = ({
  configuration,
  isEditing,
  onChange,
}: VoiceConfigurationProps) => {
  const handleVoiceIdChange = (field: 'maleVoiceId' | 'femaleVoiceId', value: string) => {
    onChange({
      ...configuration,
      [field]: value,
    });
  };

  const isValidVoiceId = (voiceId: string): boolean => {
    // ElevenLabs voice IDs are alphanumeric strings
    return /^[a-zA-Z0-9]+$/.test(voiceId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Voice Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Male Voice ID
          </label>
          <input
            type="text"
            value={configuration.maleVoiceId}
            onChange={(e) => handleVoiceIdChange('maleVoiceId', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50 transition-colors ${
              isEditing && configuration.maleVoiceId && !isValidVoiceId(configuration.maleVoiceId)
                ? 'border-2 border-red-500'
                : 'border-2 border-transparent'
            }`}
            placeholder="ElevenLabs male voice ID"
          />
          {isEditing && configuration.maleVoiceId && !isValidVoiceId(configuration.maleVoiceId) && (
            <p className="text-red-400 text-xs mt-1">Voice ID must be alphanumeric</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Female Voice ID
          </label>
          <input
            type="text"
            value={configuration.femaleVoiceId}
            onChange={(e) => handleVoiceIdChange('femaleVoiceId', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50 transition-colors ${
              isEditing && configuration.femaleVoiceId && !isValidVoiceId(configuration.femaleVoiceId)
                ? 'border-2 border-red-500'
                : 'border-2 border-transparent'
            }`}
            placeholder="ElevenLabs female voice ID"
          />
          {isEditing && configuration.femaleVoiceId && !isValidVoiceId(configuration.femaleVoiceId) && (
            <p className="text-red-400 text-xs mt-1">Voice ID must be alphanumeric</p>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 bg-dark-700/50 p-4 rounded-lg">
        <p className="mb-2">Get voice IDs from the ElevenLabs dashboard</p>
        <a 
          href="https://elevenlabs.io/app/voice-library" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-spooky-purple-400 hover:text-spooky-purple-300 hover:underline transition-colors inline-flex items-center gap-1"
        >
          Browse ElevenLabs Voice Library
          <span className="text-lg">→</span>
        </a>
      </div>
    </div>
  );
};
