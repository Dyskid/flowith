import { GetStaticProps, NextPage } from 'next';
import Layout from '../components/Layout';
import MallCard from '../components/MallCard';
import InteractiveMap from '../components/InteractiveMap';
import SearchBar from '../components/SearchBar';
import path from 'path';
import { promises as fs } from 'fs';
import Fuse from 'fuse.js';
import { useState, useMemo, useEffect } from 'react';

interface MallType {
  id: string;
  name: string;
  url: string;
  region: string;
  city?: string;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
  clickCount?: number;
  lastVerified?: string;
  description?: string;
  statusPopular?: boolean;
}

interface RegionMallData {
  [regionName: string]: number;
}

interface RegionPathDataItem {
  name: string;
  d: string;
  textX: number;
  textY: number;
  id: string;
}

interface HomePageProps {
  malls: MallType[];
  mallCountsByRegion: RegionMallData;
  regionPathData: RegionPathDataItem[];
}

const KOREA_REGION_PATH_DATA: RegionPathDataItem[] = [
  { name: '서울특별시', id: 'seoul', d: 'M100 100 L120 100 L120 120 L100 120 Z', textX: 110, textY: 110 },
  { name: '부산광역시', id: 'busan', d: 'M500 800 L520 800 L520 820 L500 820 Z', textX: 510, textY: 810 },
  { name: '대구광역시', id: 'daegu', d: 'M400 600 L420 600 L420 620 L400 620 Z', textX: 410, textY: 610 },
  { name: '인천광역시', id: 'incheon', d: 'M80 80 L100 80 L100 100 L80 100 Z', textX: 90, textY: 90 },
  { name: '광주광역시', id: 'gwangju', d: 'M250 750 L270 750 L270 770 L250 770 Z', textX: 260, textY: 760 },
  { name: '대전광역시', id: 'daejeon', d: 'M280 480 L300 480 L300 500 L280 500 Z', textX: 290, textY: 490 },
  { name: '울산광역시', id: 'ulsan', d: 'M550 700 L570 700 L570 720 L550 720 Z', textX: 560, textY: 710 },
  { name: '세종특별자치시', id: 'sejong', d: 'M260 450 L280 450 L280 470 L260 470 Z', textX: 270, textY: 460 },
  { name: '경기도', id: 'gyeonggi', d: 'M120 100 L200 100 L200 200 L120 200 Z', textX: 160, textY: 150 },
  { name: '강원도', id: 'gangwon', d: 'M200 50 L350 50 L350 250 L200 250 Z', textX: 275, textY: 150 },
  { name: '충청북도', id: 'chungbuk', d: 'M250 300 L350 300 L350 400 L250 400 Z', textX: 300, textY: 350 },
  { name: '충청남도', id: 'chungnam', d: 'M180 450 L280 450 L280 550 L180 550 Z', textX: 230, textY: 500 },
  { name: '전라북도', id: 'jeonbuk', d: 'M150 600 L280 600 L280 700 L150 700 Z', textX: 215, textY: 650 },
  { name: '전라남도', id: 'jeonnam', d: 'M100 750 L280 750 L280 900 L100 900 Z', textX: 190, textY: 825 },
  { name: '경상북도', id: 'gyeongbuk', d: 'M350 300 L550 300 L550 600 L350 600 Z', textX: 450, textY: 450 },
  { name: '경상남도', id: 'gyeongnam', d: 'M300 650 L550 650 L550 850 L300 850 Z', textX: 425, textY: 750 },
  { name: '제주특별자치도', id: 'jeju', d: 'M200 950 L300 950 L300 1000 L200 1000 Z', textX: 250, textY: 975 },
  { name: '달성군', id: 'dalseong', d: 'M410 620 L430 620 L430 640 L410 640 Z', textX: 420, textY: 630 },
  { name: '정읍', id: 'jeongeup', d: 'M200 700 L220 700 L220 720 L200 720 Z', textX: 210, textY: 710 },
  { name: '영암', id: 'yeongam', d: 'M180 880 L200 880 L200 900 L180 900 Z', textX: 190, textY: 890 },
  { name: '포항', id: 'pohang', d: 'M580 500 L600 500 L600 520 L580 520 Z', textX: 590, textY: 510 },
  { name: '안동', id: 'andong', d: 'M450 400 L470 400 L470 420 L450 420 Z', textX: 460, textY: 410 },
];

const HomePage: NextPage<HomePageProps> = ({ malls, mallCountsByRegion, regionPathData }) => {
  const svgViewBox = "0 0 800 1200";

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMalls, setFilteredMalls] = useState<MallType[]>(
     malls.map(m => ({ ...m, id: String(m.id) }))
  );

  const fuse = useMemo(() => {
    const options = {
      keys: ['name', 'region', 'tags', 'city'],
      threshold: 0.3,
      includeScore: false,
    };
    return new Fuse(malls.map(m => ({ ...m, id: String(m.id) })), options);
  }, [malls]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMalls(malls.map(m => ({ ...m, id: String(m.id) })));
    } else {
      const result = fuse.search(searchQuery.trim());
      setFilteredMalls(result.map(r => ({ ...r.item, id: String(r.item.id) })));
    }
  }, [searchQuery, malls, fuse]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary-blue">
          전국 지자체 온라인 마켓 찾기
        </h1>

        <SearchBar onSearchChange={handleSearchChange} value={searchQuery} placeholder="지역 또는 마켓 이름을 검색하세요..." />

        <section className="flex flex-col items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">지역별 마켓 수</h2>
          <InteractiveMap
            mallCountsByRegion={mallCountsByRegion}
            regionPathData={regionPathData}
            svgViewBox={svgViewBox}
          />
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">
            {searchQuery ? `'${searchQuery}' 검색 결과` : '전체 마켓 목록'}
          </h2>
          {filteredMalls.length === 0 && searchQuery !== '' ? (
            <p className="text-center text-gray-600 text-lg mt-8">
              &apos;{searchQuery}&apos;에 해당하는 마켓을 찾을 수 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMalls.map((mall) => (
                <MallCard
                  key={mall.id}
                  id={mall.id}
                  name={mall.name}
                  url={mall.url}
                  region={mall.region}
                  isNew={mall.isNew}
                  statusPopular={mall.statusPopular}
                  lastVerified={mall.lastVerified}
                  description={mall.description}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const filePath = path.join(process.cwd(), 'data', 'malls.json');
  let malls: MallType[] = [];
  try {
    const jsonData = await fs.readFile(filePath, 'utf8');
    malls = JSON.parse(jsonData);
    malls = malls.map(mall => ({ ...mall, id: String(mall.id) }));
  } catch (error) {
    console.error('Error reading malls.json:', error);
  }

  const mallCountsByRegion: RegionMallData = {};
  malls.forEach((mall) => {
    const region = mall.region;
    if (region) {
      mallCountsByRegion[region] = (mallCountsByRegion[region] || 0) + 1;
    }
  });

  return {
    props: {
      malls,
      mallCountsByRegion,
      regionPathData: KOREA_REGION_PATH_DATA,
    },
  };
};

export default HomePage;