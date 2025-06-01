import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Head>
        <title>e-Paldogangsan Mall Aggregator</title>
        <meta name="description" content="Discover online shopping malls operated by South Korean local governments." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="bg-primary-blue text-white py-4 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" passHref legacyBehavior>
            <a className="text-xl sm:text-2xl font-bold hover:text-blue-200 transition duration-300 ease-in-out tracking-tight">
              e-Paldogangsan
            </a>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-gray-200 text-gray-700 py-6 px-4 mt-12">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} e-Paldogangsan Mall Aggregator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;