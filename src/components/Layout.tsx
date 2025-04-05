
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAppState } from '@/hooks/useAppState';
import { cn } from '@/lib/utils';
import DeleteConversationModal from './DeleteConversationModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { conversationType } = useAppState();
  
  const isVoiceToVoice = conversationType === "voice-to-voice";
  
  return (
    <div className={cn(
      "bg-secondary lg:grid lg:gap-2 lg:grid-cols-[var(--sidebar-width)_1fr] min-h-dvh lg:transition-all",
      {
        "lg:grid-cols-[0px_1fr] lg:gap-0": isVoiceToVoice,
      },
    )}>
      <Sidebar />
      
      <div className={cn(
        "flex flex-col h-dvh lg:h-[calc(100dvh-16px)] w-full bg-background lg:my-2 overflow-y-auto overflow-x-hidden lg:rounded-l-3xl z-10",
        {
          "lg:rounded-none lg:h-dvh lg:my-0": isVoiceToVoice,
        },
      )}>
        <Header />
        <main className="relative flex-grow mx-auto max-w-3xl w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
      
      <DeleteConversationModal />
    </div>
  );
};

export default Layout;
