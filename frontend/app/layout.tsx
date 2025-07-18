import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeAI - Create Professional Resumes with AI',
  description: 'Build beautiful, ATS-friendly resumes in minutes with our AI-powered resume builder. Choose from professional templates and get hired faster.',
  keywords: 'resume builder, AI resume, professional resume, ATS resume, job application, career',
  authors: [{ name: 'ResumeAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumeai.com',
    title: 'ResumeAI - AI-Powered Resume Builder',
    description: 'Create professional resumes with AI assistance',
    siteName: 'ResumeAI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}