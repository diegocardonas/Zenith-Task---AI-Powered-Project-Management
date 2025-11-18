import React from 'react';
import { useTranslation } from '../i18n';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
    >
      <div
        className="bg-surface rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6">
          <h2 id="confirmation-title" className="text-2xl font-bold text-text-primary">{title}</h2>
        </header>
        <main className="p-6 pt-0">
          <p id="confirmation-message" className="text-text-secondary">{message}</p>
        </main>
        <footer className="p-4 bg-secondary/50 rounded-b-xl flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-secondary text-text-primary font-semibold rounded-lg hover:bg-secondary-focus transition-colors duration-200">
            {t('common.no')}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            {t('common.yes')}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmationModal;
