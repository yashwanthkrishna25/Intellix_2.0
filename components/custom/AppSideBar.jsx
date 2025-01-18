import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MessageCircleCode } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import SideBarFooter from './SideBarFooter';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

function AppSideBar() {
  const router = useRouter(); // Initialize the router

  const handleStartNewChat = () => {
    router.push('/'); // Redirect to the first page (home or main)
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Image 
          src={'/icon.png'} 
          alt="logo" 
          width={60} 
          height={60} 
          className="cursor-pointer" // Added cursor-pointer
          onClick={handleStartNewChat} // Optional: Logo click navigates to the homepage
        />
        <Button
          className="flex items-center gap-2 mt-5 cursor-pointer" // Added cursor-pointer
          onClick={handleStartNewChat} // Add click handler for navigation
        >
          <MessageCircleCode className="cursor-pointer" /> {/* Ensure icon has pointer */}
          Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSideBar;
