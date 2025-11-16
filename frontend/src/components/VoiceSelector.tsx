import { motion } from 'framer-motion';

export interface VoiceOption {
  id: 'male' | 'female';
  name: string;
  description: string;
  icon: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'male',
    name: 'Male Narrator',
    description: 'Deep, warm storytelling voice',
    icon: '🎙️'
  },
  {
    id: 'female',
    name: 'Female Narrator',
    description: 'Clear, engaging storytelling voice',
    icon: '🎤'
  }
];

interface VoiceSelectorProps {
  selectedVoice?: string;
  onSelect: (voice: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {VOICE_OPTIONS.map(voice => (
        <motion.button
          key={voice.id}
          onClick={() => onSelect(voice.id)}
          className={`
            p-6 rounded-lg border-2 transition-all
            ${selectedVoice === voice.id 
              ? 'border-spooky-purple-400 bg-spooky-purple-900/50 shadow-glow-purple' 
              : 'border-dark-700 bg-dark-800/50 hover:border-dark-600'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-4xl mb-2">{voice.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">{voice.name}</h3>
          <p className="text-sm text-gray-400">{voice.description}</p>
        </motion.button>
      ))}
    </div>
  );
};
