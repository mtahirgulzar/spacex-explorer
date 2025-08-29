import { FC, ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + 8;
          break;
      }

      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 8) left = 8;
      if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8;
      }
      if (top < 8) top = 8;
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = viewportHeight - tooltipRect.height - 8;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  // Hide tooltip when disabled state changes
  useEffect(() => {
    if (disabled && isVisible) {
      setIsVisible(false);
    }
  }, [disabled, isVisible]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  if (disabled) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // Add small delay to prevent flickering
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleClick = () => {
    // Immediately hide tooltip on click
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const tooltipElement = isVisible && typeof window !== 'undefined' && (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] pointer-events-none"
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
    >
      <div className="bg-gray-900 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap shadow-lg">
        {content}
      </div>
    </div>
  );

  return (
    <>
      <div 
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>
      {typeof window !== 'undefined' && createPortal(
        tooltipElement,
        document.body
      )}
    </>
  );
};

export default Tooltip;
