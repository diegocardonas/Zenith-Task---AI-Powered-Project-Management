
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
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000] backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
    >
      <div
        className="bg-surface rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-scaleIn border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-white/5">
          <h2 id="confirmation-title" className="text-xl font-bold text-text-primary">{title}</h2>
        </header>
        <main className="p-6">
          <p id="confirmation-message" className="text-text-secondary leading-relaxed">{message}</p>
        </main>
        <footer className="p-4 bg-black/20 rounded-b-xl flex justify-end gap-3 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors">
            {t('common.no')}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
          >
            {t('common.yes')}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmationModal;
