import React from 'react';

interface RegionMallData {
  [regionName: string]: number;
}

interface RegionData {
  name: string;
  d: string;
  textX: number;
  textY: number;
  id: string;
}

interface InteractiveMapProps {
  mallCountsByRegion: RegionMallData;
  regionPathData: RegionData[];
  svgViewBox?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  mallCountsByRegion,
  regionPathData,
  svgViewBox = "0 0 800 1200",
}) => {

  const handleRegionClick = (regionName: string) => {
    console.log('Region clicked:', regionName);
  };

  const getFillColorClass = (count: number): string => {
    if (count === 0) return 'fill-gray-300 dark:fill-gray-600';
    if (count > 0 && count <= 5) return 'fill-blue-300 dark:fill-blue-500';
    if (count > 5 && count <= 15) return 'fill-blue-500 dark:fill-blue-600';
    if (count > 15) return 'fill-blue-700 dark:fill-blue-800';
    return 'fill-gray-400 dark:fill-gray-500';
  };

  const getTextColorClass = (count: number): string => {
     if (count > 5) return 'fill-white';
     return 'fill-gray-800 dark:fill-gray-200';
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
      <div style={{ paddingBottom: '150%', height: 0, position: 'relative' }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={svgViewBox}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="South Korea Mall Count Map"
          role="img"
        >
          {regionPathData.map((region) => {
            const count = mallCountsByRegion[region.name] || 0;
            const fillColorClass = getFillColorClass(count);
            const textColorClass = getTextColorClass(count);

            return (
              <g
                key={region.id}
                onClick={() => handleRegionClick(region.name)}
                className="cursor-pointer"
                aria-label={`${region.name}: ${count} Malls`}
              >
                <path
                  d={region.d}
                  className={`
                    ${fillColorClass}
                    stroke-white stroke-1.5
                    hover:fill-yellow-400 hover:stroke-yellow-600
                    transition duration-200 ease-in-out
                  `}
                />
                {count > 0 && (
                  <text
                    x={region.textX}
                    y={region.textY}
                    className={`${textColorClass} text-[10px] sm:text-xs font-bold pointer-events-none`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default InteractiveMap;