import { FiX } from 'react-icons/fi';
import { Language, languages } from '../config/languages';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    firstTransitPeriod: string;
    nextSkyTrain: {
      departureTime: string;
    };
    secondTransitPeriod: string;
    finalEstimatedTime: string;
  };
  statusMessage: string;
  language: Language;
}

export default function ResultModal({ isOpen, onClose, result, statusMessage, language }: ResultModalProps) {
  if (!isOpen || !result) return null;
  const t = languages[language];

  // Helper function to format time to HH:mm
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {t.modal.title}
        </h2>
        
        <div className="space-y-3">
          <p>
            <span className="font-semibold">{t.modal.skyTrainArrival}</span>
            <br />
            {formatTime(result.firstTransitPeriod)}
          </p>
          
          <p>
            <span className="font-semibold">{t.modal.skyTrainDeparture}</span>
            <br />
            {formatTime(result.nextSkyTrain.departureTime)}
          </p>
          
          <p>
            <span className="font-semibold">{t.modal.terminalArrival}</span>
            <br />
            {formatTime(result.secondTransitPeriod)}
          </p>
          
          <p>
            <span className="font-semibold">{t.modal.checkInArrival}</span>
            <br />
            {formatTime(result.finalEstimatedTime)}
          </p>
          
          <div className="mt-6 pt-4 border-t">
            <p className="text-center font-bold italic">
              {statusMessage}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-center text-base italic">
              {t.modal.clickInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 