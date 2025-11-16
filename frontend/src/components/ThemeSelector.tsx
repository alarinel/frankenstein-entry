import { motion } from 'framer-motion';

export interface ThemeOption {
  id: 'spooky' | 'adventure' | 'fantasy';
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'spooky',
    name: 'Spooky',
    description: 'Mysterious and magical adventures with a touch of fright',
    icon: '👻',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Exciting quests and daring journeys',
    icon: '🗺️',
    gradient: 'from-blue-600 to-green-600'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magical worlds with dragons, wizards, and wonder',
    icon: '🐉',
    gradient: 'from-indigo-600 to-purple-600'
  }
];

interface ThemeSelectorProps {
  selectedTheme?: string;
  onSelect: (theme: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {THEME_OPTIONS.map(theme => (
        <motion.button
          key={theme.id}
          type="button"
          onClick={() => onSelect(theme.id)}
          className={`
            p-6 rounded-lg border-2 transition-all
            ${selectedTheme === theme.id 
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
          <div className="text-4xl mb-2">{theme.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">{theme.name}</h3>
          <p className="text-sm text-gray-400">{theme.description}</p>
        </motion.button>
      ))}
    </div>
  );
};
