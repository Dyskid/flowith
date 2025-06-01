import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import path from 'path';
import { promises as fs } from 'fs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

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

interface MallDetailPageProps {
  mall: MallType | null;
}

const MallDetailPage: NextPage<MallDetailPageProps> = ({ mall }) => {
  if (!mall) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">마켓 정보를 찾을 수 없습니다.</h1>
          <p className="mt-4 text-gray-700">요청하신 마켓의 정보를 불러오는데 실패했습니다.</p>
          <div className="mt-6">
             <Link href="/" passHref legacyBehavior>
              <a className="text-blue-700 hover:text-blue-800 transition duration-300 ease-in-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                목록으로 돌아가기
              </a>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedLastVerified = mall.lastVerified
    ? dayjs(mall.lastVerified).format('YYYY년 MM월 DD일')
    : null;

  return (
    <Layout>
      <Head>
        <title>{`${mall.name} - e-Paldogangsan`}</title>
        <meta name="description" content={`Find details about ${mall.name}, a local government online mall in ${mall.region}${mall.city ? `, ${mall.city}` : ''}.`} />
      </Head>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" passHref legacyBehavior>
            <a className="text-blue-700 hover:text-blue-800 transition duration-300 ease-in-out flex items-center text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              전체 마켓 목록으로 돌아가기
            </a>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center mb-6 border-b pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-blue flex-grow mb-4 sm:mb-0 sm:mr-6">
              {mall.name}
            </h1>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {mall.isNew && (
                <span className="px-3 py-1 text-sm font-bold text-blue-800 bg-blue-100 rounded-full">
                  새로운 마켓
                </span>
              )}
              {mall.statusPopular && (
                <span className="px-3 py-1 text-sm font-bold text-red-800 bg-red-100 rounded-full">
                  인기 마켓
                </span>
              )}
              {formattedLastVerified && (
                <span className="px-3 py-1 text-sm font-bold text-green-800 bg-green-100 rounded-full">
                  확인일: {formattedLastVerified}
                </span>
              )}
            </div>
          </div>

          <div className="text-gray-700 space-y-4 text-base">
            <p>
              <strong className="font-semibold text-gray-800">지역:</strong> {mall.region}{mall.city ? ` (${mall.city})` : ''}
            </p>
            <p>
              <strong className="font-semibold text-gray-800">공식 웹사이트:</strong>{' '}
              <a
                href={mall.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
                aria-label={`${mall.name} 공식 웹사이트`}
              >
                {mall.url}
              </a>
            </p>
            {mall.description && (
              <p>
                <strong className="font-semibold text-gray-800">설명:</strong> {mall.description}
              </p>
            )}
            {mall.tags && mall.tags.length > 0 && (
              <p>
                 <strong className="font-semibold text-gray-800">태그:</strong>{' '}
                 {mall.tags.map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2 mb-2 last:mr-0 last:mb-0">
                       #{tag}
                    </span>
                 ))}
              </p>
            )}
            {typeof mall.clickCount === 'number' && (
               <p>
                 <strong className="font-semibold text-gray-800">누적 방문 클릭 수:</strong> {mall.clickCount} 회
               </p>
            )}
          </div>

          <div className="mt-8 text-center">
             <a
               href={mall.url}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-block bg-blue-600 text-white text-lg py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium"
               aria-label={`Visit ${mall.name} official website`}
             >
               공식 웹사이트 바로가기
             </a>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'data', 'malls.json');
  let malls: MallType[] = [];
  try {
    const jsonData = await fs.readFile(filePath, 'utf8');
    malls = JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading malls.json for getStaticPaths:', error);
  }

  const paths = malls.map((mall) => ({
    params: { id: String(mall.id) },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<MallDetailPageProps> = async (context) => {
  const mallId = context.params?.id;

  const filePath = path.join(process.cwd(), 'data', 'malls.json');
  let malls: MallType[] = [];
   try {
    const jsonData = await fs.readFile(filePath, 'utf8');
    malls = JSON.parse(jsonData);
     malls = malls.map(mall => ({ ...mall, id: String(mall.id) }));
  } catch (error) {
    console.error('Error reading malls.json for getStaticProps:', error);
     return {
      notFound: true,
    };
  }

  const mall = malls.find((m) => m.id === mallId);

  if (!mall) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      mall,
    },
  };
};

export default MallDetailPage;