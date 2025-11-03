'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  greeting?: string;
  buttonText?: string;
  position?: string;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

export default function WhatsAppButton({
  phoneNumber,
  greeting = 'مرحباً! كيف يمكنني مساعدتك؟',
  buttonText = 'تواصل معنا',
  position = 'bottom-right',
  showOnMobile = true,
  showOnDesktop = true,
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render if conditions not met
  if (!phoneNumber) return null;
  if (isMobile && !showOnMobile) return null;
  if (!isMobile && !showOnDesktop) return null;

  const handleWhatsAppClick = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(greeting);
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  // Position classes based on settings
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-24 right-6',
    'top-left': 'top-24 left-6',
  }[position] || 'bottom-6 right-6';

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed ${positionClasses} z-50`}>
        {isOpen && (
          <div 
            className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-72 animate-in slide-in-from-bottom-5 duration-300"
            style={{
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {buttonText}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    متصل الآن
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {greeting}
              </p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              ابدأ المحادثة
            </button>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="فتح واتساب"
          style={{
            boxShadow: '0 10px 40px rgba(37, 211, 102, 0.3)',
          }}
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Global Styles for Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
