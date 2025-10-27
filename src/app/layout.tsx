import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { PT_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Admin-ForgeLabs',
  description: 'Admin Dashboard for ForgeLabs',
  icons:{
    icon:"/images/icon.png",
    shortcut: '/images/icon.png', 
    apple: '/images/icon.png', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", ptSans.variable)} suppressHydrationWarning>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
