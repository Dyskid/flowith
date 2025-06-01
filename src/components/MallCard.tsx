import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

interface MallCardProps {
  id: string;
  name: string;
  url: string;
  region: string;
  isNew?: boolean;
  lastVerified?: string;
  statusPopular?: boolean;
  description?: string;
}

const MallCard: React.FC<MallCardProps> = ({
  id,
  name,
  url,
  region,
  isNew,
  lastVerified,
  statusPopular,
}) => {

  const handleVisitClick = async (event: React.MouseEvent) => {
    event.stopPropagation();

    const localStorageKey = `clicked_mall_${id}`;
    const lastClickTime = localStorage.getItem(localStorageKey);
    const now = Date.now();
    const COOLDOWN_PERIOD = 5 * 1000;

    if (!lastClickTime || (now - parseInt(lastClickTime, 10) > COOLDOWN_PERIOD)) {
       localStorage.setItem(localStorageKey, now.toString());

      try {
        const response = await fetch('/api/track-click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mallId: id }),
        });

        if (!response.ok) {
           console.error(`Failed to track click for mall ID: ${id}. Status: ${response.status}`);
        }

      } catch (error) {
        console.error(`Error calling track-click API for mall ID: ${id}`, error);
      }
    }

    window.open(url, '_blank');
  };

  const formattedLastVerified = lastVerified
    ? dayjs(lastVerified).format('YYYY년 MM월 DD일')
    : null;

  return (
    <Link href={`/malls/${id}`} passHref legacyBehavior>
      <a className="block border border-gray-200 rounded-lg shadow-sm p-5 bg-white transition transform hover:-translate-y-1 hover:shadow-lg flex flex-col h-full cursor-pointer">
        <div className="flex items-start mb-3 min-h-[3rem]">
          <h2 className="text-lg font-semibold text-gray-800 flex-grow mr-3">
            {name}
          </h2>
          <div className="flex flex-wrap justify-end gap-1 flex-shrink-0">
            {isNew && (
              <span className="px-2 py-0.5 text-xs font-bold text-blue-800 bg-blue-100 rounded">
                새로운
              </span>
            )}
             {statusPopular && (
              <span className="px-2 py-0.5 text-xs font-bold text-red-800 bg-red-100 rounded">
                인기
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3">{region}</p>

        {formattedLastVerified && (
           <p className="text-gray-500 text-xs mb-4">
             <strong className="font-medium">확인일:</strong> {formattedLastVerified}
           </p>
        )}

        <button
          onClick={handleVisitClick}
          className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm font-medium"
          aria-label={`Visit ${name} official website`}
        >
          공식 웹사이트 방문하기
        </button>
      </a>
    </Link>
  );
};

export default MallCard;