import React from 'react';

interface ResponsiveSvgProps {
  svgString: string | undefined | null;
  className?: string;
}

/**
 * A simple component that renders an SVG string and makes it scale
 * correctly within a container by removing its fixed dimensions.
 */
const ResponsiveSvg: React.FC<ResponsiveSvgProps> = ({ svgString, className }) => {
  if (!svgString) return null;

  // By removing width/height, the SVG will scale to fit its parent container
  // while maintaining its original aspect ratio.
  const finalSvg = svgString
    .replace(/\s?width="[^"]+"/, '')
    .replace(/\s?height="[^"]+"/, '');
    
  return <div className={className} dangerouslySetInnerHTML={{ __html: finalSvg }} />;
};

export default ResponsiveSvg;