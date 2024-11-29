import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Language, languages } from '../config/languages';

// Define variants for container and items
const containerVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    x: 20, 
    opacity: 0 
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: { 
    x: 20, 
    opacity: 0 
  }
};

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
}

function AccordionItem({ title, content }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border-b"
      variants={itemVariants}
    >
      <button
        className="w-full py-4 px-6 text-left hover:bg-gray-50 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface InfoAccordionProps {
  language: Language;
  isVisible: boolean;
}

export default function InfoAccordion({ language, isVisible }: InfoAccordionProps) {
  const t = languages[language];

  return (
    <motion.div 
      className="border rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="exit"
    >
      <AccordionItem
        title={t.accordion.accuracy.title}
        content={t.accordion.accuracy.content}
      />
      <AccordionItem
        title={t.accordion.feedback.title}
        content={t.accordion.feedback.content}
      />
      <AccordionItem
        title={t.accordion.source.title}
        content={
          <div>
            <p>
              {t.accordion.source.trainAccount}{' '}
              <a 
                href="https://www.instagram.com/kacommuterbandara/?hl=en" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @kacommuterbandara
              </a>
            </p>
            <br />
            <p>
              {t.accordion.source.skyTrainWebsite}{' '}
              <a 
                href="https://soekarnohatta-airport.co.id/panduanpenumpang/transportation/19/kalayang" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t.accordion.source.skyTrainLink}
              </a>
            </p>
          </div>
        }
      />
      <AccordionItem
        title={t.accordion.booking.title}
        content={
          <div>
            <p>
              {t.accordion.booking.trainInfo}{' '}
              <a 
                href="https://reservation.kci.id" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t.accordion.booking.trainLink}
              </a>
            </p>
            <br />
            <p>{t.accordion.booking.skyTrainInfo}</p>
          </div>
        }
      />
    </motion.div>
  );
} 