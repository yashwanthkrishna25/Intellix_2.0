import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Modal from '../ui/modal'; // Import a reusable modal component
import { UserDetailContext } from '@/context/UserDetailContext';
import Colors from '@/data/Colors';

function SideBarFooter() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const options = [
    {
      name: 'Settings',
      icon: Settings,
      action: () => {
        setIsSettingsModalOpen(true); // Open the settings modal
      },
    },
    {
      name: 'Help Center',
      icon: HelpCircle,
    },
    {
      name: 'My Subscription',
      icon: Wallet,
      path: '/pricing',
    },
    {
      name: 'Sign Out',
      icon: LogOut,
      action: () => {
        localStorage.removeItem('userDetail'); // Clear user data
        router.push('/'); // Redirect to the first page
      },
    },
  ];

  const onOptionClick = (option) => {
    if (option.action) {
      option.action(); // Execute the custom action if defined
    } else if (option.path) {
      router.push(option.path); // Navigate to the specified path
    } else {
      console.error('No action or path defined for this option.');
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          variant="ghost"
          onClick={() => onOptionClick(option)}
          key={index}
          className="w-full flex justify-start my-3 cursor-pointer" // Added cursor-pointer
        >
          <option.icon className="w-5 h-5 mr-2" />
          <span>{option.name}</span>
        </Button>
      ))}
      <div className="mt-8">
        <Button className="w-full flex items-center justify-between" variant="ghost">
          <span
            className="font-bold px-3 py-1 rounded border cursor-pointer"
            style={{
              backgroundColor: Colors.BACKGROUND,
              borderColor: 'rgba(0, 255, 255, 0.4)', // Subtle light cyan border
              borderWidth: '2px', // Make the border more visible
            }}
          >
            {userDetail?.token || 0} :Tokens Left
          </span>
        </Button>
      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <Modal title="Settings" onClose={() => setIsSettingsModalOpen(false)}>
          <div className="flex flex-col gap-4 p-4">
            {/* Example settings options */}
            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                className="toggle toggle-primary cursor-pointer" // Added cursor-pointer
                onChange={(e) => {
                  const isDarkMode = e.target.checked;
                  document.body.classList.toggle('dark', isDarkMode); // Simple dark mode toggle
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Update Profile</span>
              <Button
                variant="outline"
                onClick={() => {
                  router.push('/profile'); // Redirect to profile update page
                }}
                className="cursor-pointer" // Added cursor-pointer
              >
                Edit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SideBarFooter;
