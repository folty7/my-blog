import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  showPattern?: boolean;
}

export default function GridContainer({ children, className = '', style, wrapperClassName = '', wrapperStyle, showPattern = false }: GridContainerProps) {
  return (
    <div className={`section-wrapper ${wrapperClassName}`} style={wrapperStyle}>
      {showPattern && (
        <svg className="diagonal-pattern" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.6 }}>
          <defs>
            <pattern id="grid-pattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="white" strokeOpacity="0.1" strokeWidth="1.5"></line>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
        </svg>
      )}
      <div className={`grid-container ${className}`} style={style}>
        {children}
        <div className="grid-diamond left"></div>
        <div className="grid-diamond right"></div>
      </div>
    </div>
  );
}
