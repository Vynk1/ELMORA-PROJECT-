import React, { useState, useEffect, Suspense, lazy } from 'react';

// Lazy load the 3D component to avoid bundle bloat  
const FlowerGrowth3D = lazy(() => import('./FlowerGrowth'));

interface FlowerGrowthWrapperProps {
  percentage: number;
  onFlowerClick?: () => void;
  disabled?: boolean;
  showTooltip?: boolean;
  className?: string;
  preferredMode?: '3d' | 'svg' | 'auto';
}

// SVG Fallback Component
const FlowerSVGFallback: React.FC<{
  percentage: number;
  onFlowerClick?: () => void;
  showTooltip?: boolean;
  className?: string;
}> = ({ percentage, onFlowerClick, showTooltip, className = "" }) => {
  const getStageClass = (percentage: number) => {
    if (percentage === 0) return 'seed';
    if (percentage <= 25) return 'sprout';
    if (percentage <= 50) return 'small-plant';
    if (percentage <= 75) return 'growing';
    if (percentage < 100) return 'blooming';
    return 'full-bloom';
  };

  const stage = getStageClass(percentage);
  const tooltip = `Your flower is ${percentage}% grown - keep going!`;

  return (
    <div
      className={`relative ${className} cursor-pointer`}
      style={{ height: '200px', width: '200px', margin: '0 auto' }}
      title={showTooltip ? tooltip : undefined}
      aria-label={tooltip}
      role="img"
      tabIndex={0}
      onClick={onFlowerClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlowerClick?.();
        }
      }}
    >
      <style>{`
        .flower-stage {
          opacity: 0;
          transition: opacity 0.8s ease-out;
        }
        .flower-stage.${stage} {
          opacity: 1 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .flower-stage {
            transition: none;
          }
          .particles animate {
            animation-play-state: paused;
          }
        }
      `}</style>
      
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Flower Pot */}
        <defs>
          <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:'#DEB887', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#D2691E', stopOpacity:1}} />
          </linearGradient>
          
          <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#228B22', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#32CD32', stopOpacity:1}} />
          </linearGradient>
          
          <radialGradient id="petalGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style={{stopColor:'#FFB6C1', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#FF1493', stopOpacity:1}} />
          </radialGradient>
          
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" floodColor="#000000"/>
          </filter>
        </defs>
        
        {/* Pot Base */}
        <ellipse cx="100" cy="185" rx="35" ry="8" fill="#8B4513" opacity="0.6"/>
        
        {/* Pot Body */}
        <path d="M65 160 L135 160 L130 185 L70 185 Z" fill="url(#potGradient)" filter="url(#dropShadow)"/>
        
        {/* Pot Rim */}
        <ellipse cx="100" cy="160" rx="35" ry="5" fill="#A0522D"/>
        
        {/* Soil */}
        <ellipse cx="100" cy="160" rx="32" ry="3" fill="#8B4513"/>
        
        {/* Seed (0%) */}
        <g className="flower-stage seed">
          <circle cx="100" cy="155" r="3" fill="#8B4513"/>
        </g>
        
        {/* Sprout (1-25%) */}
        <g className="flower-stage sprout">
          <rect x="98" y="140" width="4" height="20" fill="url(#stemGradient)" rx="2"/>
        </g>
        
        {/* Small Plant (26-50%) */}
        <g className="flower-stage small-plant">
          <rect x="98" y="120" width="4" height="40" fill="url(#stemGradient)" rx="2"/>
          <ellipse cx="85" cy="135" rx="12" ry="6" fill="#32CD32" transform="rotate(-30 85 135)"/>
          <ellipse cx="115" cy="140" rx="12" ry="6" fill="#32CD32" transform="rotate(30 115 140)"/>
        </g>
        
        {/* Growing (51-75%) */}
        <g className="flower-stage growing">
          <rect x="98" y="100" width="4" height="60" fill="url(#stemGradient)" rx="2"/>
          <ellipse cx="82" cy="125" rx="14" ry="7" fill="#32CD32" transform="rotate(-25 82 125)"/>
          <ellipse cx="118" cy="130" rx="14" ry="7" fill="#32CD32" transform="rotate(25 118 130)"/>
          <ellipse cx="85" cy="145" rx="13" ry="6" fill="#228B22" transform="rotate(-35 85 145)"/>
          <circle cx="100" cy="95" r="8" fill="#90EE90"/>
        </g>
        
        {/* Blooming (76-99%) */}
        <g className="flower-stage blooming">
          <rect x="98" y="90" width="4" height="70" fill="url(#stemGradient)" rx="2"/>
          <ellipse cx="80" cy="120" rx="15" ry="8" fill="#32CD32" transform="rotate(-25 80 120)"/>
          <ellipse cx="120" cy="125" rx="15" ry="8" fill="#32CD32" transform="rotate(25 120 125)"/>
          <ellipse cx="82" cy="140" rx="14" ry="7" fill="#228B22" transform="rotate(-35 82 140)"/>
          <ellipse cx="118" cy="145" rx="14" ry="7" fill="#228B22" transform="rotate(35 118 145)"/>
          
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
            <ellipse
              key={i}
              cx="100" cy="75" rx="8" ry="20"
              fill="url(#petalGradient)"
              opacity="0.9"
              transform={`rotate(${rotation} 100 75)`}
            />
          ))}
          
          <circle cx="100" cy="75" r="8" fill="#FFD700"/>
        </g>
        
        {/* Full Bloom (100%) */}
        <g className="flower-stage full-bloom">
          <rect x="98" y="85" width="4" height="75" fill="url(#stemGradient)" rx="2"/>
          <ellipse cx="78" cy="115" rx="16" ry="9" fill="#32CD32" transform="rotate(-25 78 115)"/>
          <ellipse cx="122" cy="120" rx="16" ry="9" fill="#32CD32" transform="rotate(25 122 120)"/>
          <ellipse cx="80" cy="135" rx="15" ry="8" fill="#228B22" transform="rotate(-35 80 135)"/>
          <ellipse cx="120" cy="140" rx="15" ry="8" fill="#228B22" transform="rotate(35 120 140)"/>
          
          {/* Full Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, i) => (
            <ellipse
              key={i}
              cx="100" cy="70" rx="10" ry="22"
              fill="url(#petalGradient)"
              transform={`rotate(${rotation} 100 70)`}
            />
          ))}
          
          {/* Glowing Center */}
          <circle cx="100" cy="70" r="10" fill="#FFD700">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="70" r="6" fill="#FFA500" opacity="0.8"/>
          
          {/* Celebration particles */}
          <g className="particles">
            {[
              { x: 85, y: 55, dur: "3s" },
              { x: 115, y: 50, dur: "2.5s" },
              { x: 95, y: 45, dur: "3.5s" },
              { x: 105, y: 48, dur: "2.8s" }
            ].map((particle, i) => (
              <circle
                key={i}
                cx={particle.x}
                cy={particle.y}
                r={i < 2 ? 2 : 1.5}
                fill={i < 2 ? "#FFD700" : "#FFA500"}
                opacity="0.7"
              >
                <animate attributeName="cy" values={`${particle.y};${particle.y - 25};${particle.y}`} dur={particle.dur} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;1;0" dur={particle.dur} repeatCount="indefinite"/>
              </circle>
            ))}
          </g>
        </g>
      </svg>
      
      {/* Screen reader text */}
      <div className="sr-only">
        Flower growth visualization showing {stage} stage at {percentage}% completion
      </div>
    </div>
  );
};


// Main wrapper component
const FlowerGrowthWrapper: React.FC<FlowerGrowthWrapperProps> = ({
  percentage,
  onFlowerClick,
  disabled = false,
  showTooltip = true,
  className = "",
  preferredMode = 'auto'
}) => {
  const [renderMode, setRenderMode] = useState<'3d' | 'svg'>('svg');
  const [isWebGLSupported, setIsWebGLSupported] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const webglSupported = !!gl;
    setIsWebGLSupported(webglSupported);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Determine render mode based on capabilities and preferences
    if (preferredMode === '3d' && webglSupported && !prefersReducedMotion) {
      setRenderMode('3d');
    } else if (preferredMode === 'auto') {
      if (webglSupported && !prefersReducedMotion) {
        setRenderMode('3d');
      } else {
        setRenderMode('svg');
      }
    } else {
      setRenderMode('svg');
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, [preferredMode]);

  // Error boundary for 3D component
  const handle3DError = () => {
    console.warn('3D flower component failed, falling back to SVG');
    setHasError(true);
    setRenderMode('svg');
  };

  const handleClick = () => {
    if (!disabled && onFlowerClick) {
      onFlowerClick();
    }
  };

  // Render based on mode and error state
  if (renderMode === '3d' && !hasError) {
    return (
      <Suspense fallback={
        <FlowerSVGFallback
          percentage={percentage}
          onFlowerClick={handleClick}
          showTooltip={showTooltip}
          className={className}
        />
      }>
        <div onError={handle3DError}>
          <FlowerGrowth3D
            percentage={percentage}
            onFlowerClick={handleClick}
            disabled={disabled}
            showTooltip={showTooltip}
            className={className}
          />
        </div>
      </Suspense>
    );
  }

  // Default to SVG fallback
  return (
    <FlowerSVGFallback
      percentage={percentage}
      onFlowerClick={handleClick}
      showTooltip={showTooltip}
      className={className}
    />
  );
};

export default FlowerGrowthWrapper;