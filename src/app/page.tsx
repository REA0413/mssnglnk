"use client";

import { Analytics } from "@vercel/analytics/react"
import { useState, useEffect } from "react";
import {
  calculateTimesAction,
  getStationsAction,
  getDepartureTimesAction,
  getTerminalsAction,
} from "../../actions/schedule-actions";
import { FiInfo, FiLoader, FiMail } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import TimePicker from "react-time-picker";
import ResultModal from '../components/ResultModal';
import WelcomeModal from '../components/WelcomeModal';
import AnimatedGallery from '../components/AnimatedGallery';
import InfoAccordion from '../components/InfoAccordion';
import { motion } from 'framer-motion';
import { languages, Language } from '../config/languages';
import LanguageSelector from '../components/LanguageSelector';
import MorphingAnimation from '../components/MorphingAnimation';

// Add these custom styles either in your global CSS or as a style tag in your component
const customStyles = `
  .react-time-picker__wrapper {
    border: none;
  }
  
  .react-time-picker__inputGroup__input:invalid {
    background-color: #f0f0f0;
  }
`;

interface CalculationResult {
  finalEstimatedTime: string;
  firstTransitPeriod: string;
  nextSkyTrain: {
    departureTime: string;
  };
  secondTransitPeriod: string;
}

export default function Home() {
  const [stations, setStations] = useState<string[]>([]);
  const [departureTimes, setDepartureTimes] = useState<string[]>([]);
  const [terminals, setTerminals] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    departureStation: "",
    chosenAirportTerminal: "",
    departureTime: "",
    expectedTimeAtCheckInCounter: "",
  });
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<string>("");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepartureTimesLoading, setIsDepartureTimesLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  const [showTwoColumns, setShowTwoColumns] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const t = languages[currentLanguage]; // Get current language translations
  const [showAccordion, setShowAccordion] = useState(false);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      const result = await getStationsAction();
      if (result.status === "success" && result.data) {
        setStations(result.data);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const fetchDepartureTimes = async () => {
      if (formData.departureStation) {
        setIsDepartureTimesLoading(true);
        try {
          const result = await getDepartureTimesAction(formData.departureStation);
          if (result.status === "success" && result.data) {
            setDepartureTimes(result.data);
          }
        } catch (error) {
          console.error("Error fetching departure times:", error);
        } finally {
          setIsDepartureTimesLoading(false);
        }
      } else {
        setDepartureTimes([]);
      }
    };

    fetchDepartureTimes();
  }, [formData.departureStation]);

  useEffect(() => {
    const fetchTerminals = async () => {
      const result = await getTerminalsAction();
      if (result.status === "success" && result.data) {
        setTerminals(result.data);
      }
    };

    fetchTerminals();
  }, []);

  const resetForm = () => {
    setFormData({
      departureStation: "",
      chosenAirportTerminal: "",
      departureTime: "",
      expectedTimeAtCheckInCounter: "",
    });
    setShowResults(false);
    setCalculationResult(null);
    setLastCalculation("");
    setIsFormSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsAnimationVisible(true);

    try {
      const result = await calculateTimesAction({
        departureTime: formData.departureTime,
        terminal: formData.chosenAirportTerminal,
        expectedTime: formData.expectedTimeAtCheckInCounter,
        language: currentLanguage
      });

      if (result.status === "success" && result.data) {
        setCalculationResult(result.data);
        setShowResults(true);
        setIsFormSubmitted(true);

        const expectedTime = new Date(`1970-01-01T${formData.expectedTimeAtCheckInCounter}`);
        const finalTime = new Date(`1970-01-01T${result.data.finalEstimatedTime}`);
        const timeDiff = (expectedTime.getTime() - finalTime.getTime()) / (1000 * 60);

        let message = '';
        if (timeDiff >= 5) {
          message = currentLanguage === 'en' 
            ? "🟢 You have sufficient time to reach the Check In counter at the desired time 🟢"
            : "🟢 Anda akan memiliki waktu yang cukup untuk tiba di konter Check In sesuai waktu yang diinginkan 🟢";
        } else if (timeDiff >= 0) {
          message = currentLanguage === 'en'
            ? "🟡 🏃 💨 You must be ready to jog or run a bit in every stage of your journey to reach the Check In counter at the desired time 🏃‍♀️💨 🟡"
            : "🟡 🏃 💨 Anda harus siap untuk berjalan cepat atau berlari sedikit di setiap tahap perjalanan untuk tiba di konter Check In sesuai waktu yang diinginkan 🏃‍♀️💨 🟡";
        } else {
          message = currentLanguage === 'en'
            ? "🔴 Don't take a risk, buy an earlier airport train schedule 🔴"
            : "🔴 Jangan ambil risiko, beli jadwal kereta bandara yang lebih awal 🔴";
        }

        setStatusMessage(message);
        setLastCalculation(JSON.stringify({ ...result.data, statusMessage: message }));
        
        // Wait for animation to complete (1 second) then show modal
        setTimeout(() => {
          setIsModalOpen(true);
        }, 500);
      } else {
        alert(result.message);
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error calculating times:", error);
      alert(currentLanguage === 'en' 
        ? "No sky train schedule found, please select earlier airport train schedule!"
        : "Jadwal kereta layang tidak ditemukan, silakan pilih jadwal kereta bandara yang lebih awal!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedisplay = () => {
    const savedResult = JSON.parse(lastCalculation);
    setCalculationResult(savedResult);
    setStatusMessage(savedResult.statusMessage);
    setIsModalOpen(true);
  };

  const getStatusBox = () => {
    if (!calculationResult || !showResults) return null;

    const expectedTime = new Date(
      `1970-01-01T${formData.expectedTimeAtCheckInCounter}`
    );
    const finalTime = new Date(
      `1970-01-01T${calculationResult.finalEstimatedTime}`
    );
    const timeDiff =
      (expectedTime.getTime() - finalTime.getTime()) / (1000 * 60); // difference in minutes

    if (timeDiff >= 5) {
      return (
        <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-800 text-center font-semibold">
          {currentLanguage === 'en' ? "Yes, you're good to go!" : "Aman, waktu Anda cukup!"}
        </div>
      );
    } else if (timeDiff >= 0) {
      return (
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg text-yellow-800 text-center font-semibold">
          {currentLanguage === 'en' ? "It's a bit tight, but you'll make it!" : "Agak mepet, tapi ada kemungkinan kecil bisa kekejar!"}
        </div>
      );
    } else {
      return (
        <div className="mt-4 p-4 bg-red-100 rounded-lg text-red-800 text-center font-semibold">
          {currentLanguage === 'en' 
            ? "You should choose earlier Airport Train schedule!" 
            : "Ngga akan kekejar, pilih jadwal Kereta Bandara yang lebih awal!"}
        </div>
      );
    }
  };

  useEffect(() => {
    if (isLoading) {
      setIsAnimationVisible(true);
    } else if (!isLoading && isAnimationVisible) {
      const timer = setTimeout(() => {
        setIsAnimationVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAnimationVisible]);

  return (
    <main
      className="min-h-screen p-8 relative"
      style={{ fontFamily: "Johnston100, sans-serif" }}
    >
      <LanguageSelector 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <h1 className="text-2xl font-bold mb-2 text-center">
        {t.titleLine1}
      </h1>

      <h1 className="text-2xl font-bold mb-6 text-center">
        {t.titleLine2}
      </h1>

      <p className="text-base text-gray-700 mb-6 text-center">
        {t.subtitle}
      </p>

      <style>{customStyles}</style>

      <AnimatedGallery 
        onComplete={() => {
          setShowTwoColumns(true);
          setTimeout(() => setShowAccordion(true), 500);
        }} 
        showTwoColumns={showTwoColumns} 
      />

      <motion.div
        className={`flex ${showTwoColumns ? 'justify-between gap-8' : 'justify-center'}`}
        animate={{ width: showTwoColumns ? '100%' : 'auto' }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={showTwoColumns ? 'w-1/2' : 'w-full'}
          animate={{ width: showTwoColumns ? '50%' : '100%' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="max-w-md space-y-4 w-full">
              <div className="mt-4">
                <label className="block mb-2 flex items-center">
                  {t.form.expectedTime.label}
                  <div className="relative inline-block ml-2">
                    <FiInfo
                      className="text-gray-500 cursor-pointer"
                      onMouseEnter={() =>
                        setActiveTooltip("expectedTimeAtCheckInCounter")
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "expectedTimeAtCheckInCounter" && (
                      <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-800 rounded-lg shadow-lg -left-20 top-6">
                        {t.form.expectedTime.tooltip}
                        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -top-1 left-24"></div>
                      </div>
                    )}
                  </div>
                </label>
                <TimePicker
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      expectedTimeAtCheckInCounter: value || "",
                    });
                  }}
                  value={formData.expectedTimeAtCheckInCounter}
                  format="HH:mm"
                  disableClock={true}
                  clearIcon={null}
                  required={true}
                  className={`w-full p-2 border rounded ${
                    isFormSubmitted ? 'bg-gray-100' : ''
                  }`}
                  hourPlaceholder="hh"
                  minutePlaceholder="mm"
                  disabled={isFormSubmitted}
                />
              </div>

              <div>
                <label className="block mb-2 flex items-center">
                  {t.form.terminal.label}
                  <div className="relative inline-block ml-2">
                    <FiInfo
                      className="text-gray-500 cursor-pointer"
                      onMouseEnter={() => setActiveTooltip("terminal")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "terminal" && (
                      <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-800 rounded-lg shadow-lg -left-20 top-6">
                        {t.form.terminal.tooltip}
                        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -top-1 left-24"></div>
                      </div>
                    )}
                  </div>
                </label>
                <select
                  value={formData.chosenAirportTerminal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chosenAirportTerminal: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">{t.form.terminal.placeholder}</option>
                  {terminals.map((terminal) => (
                    <option key={terminal} value={terminal}>
                      {terminal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 flex items-center">
                  {t.form.departureStation.label}
                  <div className="relative inline-block ml-2">
                    <FiInfo
                      className="text-gray-500 cursor-pointer"
                      onMouseEnter={() => setActiveTooltip("departureStation")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "departureStation" && (
                      <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-800 rounded-lg shadow-lg -left-20 top-6">
                        {t.form.departureStation.tooltip}
                        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -top-1 left-24"></div>
                      </div>
                    )}
                  </div>
                </label>
                <select
                  value={formData.departureStation}
                  onChange={(e) =>
                    setFormData({ ...formData, departureStation: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">{t.form.departureStation.placeholder}</option>
                  {stations.map((station) => (
                    <option key={station} value={station}>
                      {station}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 flex items-center">
                  {t.form.departureTime.label}
                  <div className="relative inline-block ml-2">
                    <FiInfo
                      className="text-gray-500 cursor-pointer"
                      onMouseEnter={() => setActiveTooltip("departureTime")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                    {activeTooltip === "departureTime" && (
                      <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-800 rounded-lg shadow-lg -left-20 top-6">
                        {t.form.departureTime.tooltip}
                        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -top-1 left-24"></div>
                      </div>
                    )}
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={formData.departureTime}
                    onChange={(e) =>
                      setFormData({ ...formData, departureTime: e.target.value })
                    }
                    className={`w-full p-2 border rounded ${
                      isDepartureTimesLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    required
                    disabled={isDepartureTimesLoading}
                  >
                    <option value="">{t.form.departureTime.placeholder}</option>
                    {departureTimes.map((time) => (
                      <option key={time} value={time}>
                        {time.substring(0, 5)}
                      </option>
                    ))}
                  </select>
                  {isDepartureTimesLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                      <FiLoader className="animate-spin text-blue-500 text-xl" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded text-white flex items-center justify-center relative ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      <MorphingAnimation 
                        isVisible={isAnimationVisible} 
                        onAnimationComplete={() => setIsAnimationVisible(false)}
                      />
                      {t.form.buttons.calculating}
                    </>
                  ) : (
                    t.form.buttons.submit
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className={`py-2 px-4 rounded text-white ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {t.form.buttons.reset}
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-center">
            {showResults && getStatusBox()}
          </div>

          <div className="flex justify-center">
            {lastCalculation && (
              <button
                onClick={handleRedisplay}
                disabled={isLoading}
                className={`mt-4 w-full max-w-md py-2 px-4 rounded text-white ${
                  isLoading 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {t.form.buttons.redisplay}
              </button>
            )}
          </div>
        </motion.div>

        {showTwoColumns && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 pb-4 pt-6 pl-4 pr-32"
          >
            <InfoAccordion 
              language={currentLanguage}
              isVisible={showAccordion}
            />
            <button
              onClick={() => {
                setShowAccordion(false);
                setTimeout(() => setShowTwoColumns(false), 500);
              }}
              className="mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {t.form.buttons.hideInfo}
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-6 text-center space-y-4">
        <div className="flex justify-center gap-4">
          <a
            href="mailto:cctozfnt@gmail.com"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Email"
          >
            <FiMail size={24} />
          </a>
          <a
            href="https://twitter.com/andong_ff"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Twitter"
          >
            <FaXTwitter size={22} />
          </a>
        </div>
        
        <div className="space-y-1">
          <a
            href="http://www.onlinewebfonts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 block"
          >
            Web Fonts Author Credit
          </a>
          <a
            href="http://www.freepik.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 block"
          >
            Online GIFs Attribution
          </a>
        </div>
      </div>

      <ResultModal
        isOpen={isModalOpen && calculationResult !== null}
        onClose={() => setIsModalOpen(false)}
        result={calculationResult!}
        statusMessage={statusMessage}
        language={currentLanguage}
      />

      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        language={currentLanguage}
      />
    </main>
  );
}
