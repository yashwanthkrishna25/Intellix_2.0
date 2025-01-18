import Image from 'next/image';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import Colors from '@/data/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useRouter, usePathname } from 'next/navigation';
import { LucideDownload, Rocket } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext); // Fixed typo in `setUserDetail`
   // Assuming ActionContext is defined elsewhere
  const path = usePathname();

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="flex items-center justify-between p-4">
      {/* Logo with Responsive Neon RGB Effect */}
      <h2 className="rgb-neon-text responsive-text">Intellix</h2>

      {/* Authentication Buttons */}
      {!userDetail?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{ backgroundColor: Colors.BLUE }}
          >
            Get Started
          </Button>
        </div>
      ) : path?.includes('workspace') ? (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onActionBtn('export')}>
            <LucideDownload /> Export
          </Button>
          <Button
            className="text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => onActionBtn('deploy')}
          >
            <Rocket /> Deploy
          </Button>
          {userDetail && (
            <Image
              src={userDetail?.picture}
              alt="user"
              width={30}
              height={30}
              className="rounded-full w-[30px]"
             
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Header;
