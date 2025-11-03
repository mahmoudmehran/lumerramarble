'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="12" fill="#25D366"/>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" fill="white"/>
  </svg>
)

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
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <WhatsAppIcon className="w-6 h-6" />
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
              <WhatsAppIcon className="w-5 h-5" />
              ابدأ المحادثة
            </button>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white hover:bg-gray-50 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 animate-bounce hover:animate-none"
          aria-label="فتح واتساب"
          style={{
            boxShadow: '0 10px 40px rgba(37, 211, 102, 0.4)',
          }}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-gray-700" />
          ) : (
            <WhatsAppIcon className="w-8 h-8" />
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
