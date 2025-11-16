import { ApiConfiguration } from '@/types/admin';

interface ConfigurationEditorProps {
  configuration: ApiConfiguration;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (config: ApiConfiguration) => void;
}

export const ConfigurationEditor = ({
  configuration,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: ConfigurationEditorProps) => {
  const handleFieldChange = (field: keyof ApiConfiguration, value: number) => {
    onChange({
      ...configuration,
      [field]: value,
    });
  };

  return (
    <div className="bg-dark-800/80 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Configuration</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
              >
                ❌ Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-spooky-purple-600 hover:bg-spooky-purple-700 rounded-lg text-white transition-colors"
              >
                💾 Save
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-spooky-purple-600 hover:bg-spooky-purple-700 rounded-lg text-white transition-colors"
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Anthropic Input Cost (per 1M tokens)
          </label>
          <input
            type="number"
            step="0.01"
            value={configuration.anthropicInputCostPerMillionTokens}
            onChange={(e) =>
              handleFieldChange('anthropicInputCostPerMillionTokens', parseFloat(e.target.value))
            }
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Anthropic Output Cost (per 1M tokens)
          </label>
          <input
            type="number"
            step="0.01"
            value={configuration.anthropicOutputCostPerMillionTokens}
            onChange={(e) =>
              handleFieldChange('anthropicOutputCostPerMillionTokens', parseFloat(e.target.value))
            }
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Stability AI Cost (per image)
          </label>
          <input
            type="number"
            step="0.001"
            value={configuration.stabilityImageCostPerImage}
            onChange={(e) =>
              handleFieldChange('stabilityImageCostPerImage', parseFloat(e.target.value))
            }
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            ElevenLabs Cost (per character)
          </label>
          <input
            type="number"
            step="0.00001"
            value={configuration.elevenlabsCostPerCharacter}
            onChange={(e) =>
              handleFieldChange('elevenlabsCostPerCharacter', parseFloat(e.target.value))
            }
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            ElevenLabs Max Concurrent Requests
          </label>
          <input
            type="number"
            value={configuration.elevenlabsMaxConcurrentRequests}
            onChange={(e) =>
              handleFieldChange('elevenlabsMaxConcurrentRequests', parseInt(e.target.value))
            }
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Max Stories Per Day
          </label>
          <input
            type="number"
            value={configuration.maxStoriesPerDay}
            onChange={(e) =>
              handleFieldChange('maxStoriesPerDay', parseInt(e.target.value))
            }
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-dark-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};
