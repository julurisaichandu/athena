'use client';
import { UserButton, currentUser } from '@clerk/nextjs';
import { Icon } from './icon';
import Link from 'next/link';
// import ConversationHistory from './conversation-history';
import { IoAddOutline } from 'react-icons/io5';
import { RiHistoryLine, RiQuestionLine, RiDatabaseLine } from 'react-icons/ri';
import { useParams, usePathname, useRouter } from 'next/navigation';

export function Sidebar() {
  // const currentUserData = currentUser();

  // If the user data is falsy, return null. This is needed on the auth pages as the user is authenticated then.
  // if (!currentUserData) {
  //   return null;
  // }

  // If the user gave us their name during signup, check here to influence styling on the page and whether we should show the name
  // const hasUserGivenName =
  //   currentUserData.firstName && currentUserData.lastName;

  const hasUserGivenName = true;

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  // Use useParams to access dynamic route parameters
  const params = useParams();
  const { uuid } = params; // Access uuid from the dynamic segment
  console.log("uuid from sidebar",uuid);
  // Directly link to /[uuid]/history page
  const historyLink = `/${uuid}/history`;
  const helpLink = `/${uuid}/athena-help`;
  const dbVizLink = `/${uuid}/db-visualizer`;
  return (
    <aside className="flex flex-col justify-start min-h-screen w-full py-6 px-8 max-w-60 bg-[#e3e3e369] gap-12">
      <header className="flex flex-row gap-2 justify-between items-center">
        <Link href="#" className="flex flex-row gap-2 items-center">
          <Icon />
          <p className="text-gray-700 font-bold">Athena</p>
        </Link>
        {/* <Link
          href="#"
          className='flex flex-row justify-start items-center group bg-slate-200 p-2 h-max rounded-sm hover:bg-slate-100 transiiton-all ease-in-out duration-300"'
        >
          <IoAddOutline />
        </Link> */}
      </header>
      <div className="flex flex-col gap-4">
        {/* History */}
        <Link
          href={historyLink}
          className={`flex flex-row items-center gap-2 p-2 rounded-sm transition-all duration-300 ease-in-out ${
            isActive('/history') ? 'bg-slate-400 text-white' : 'bg-transparent text-gray-700 hover:bg-slate-200'
          }`}
        >
          <RiHistoryLine size={20} />
          <p>History</p>
        </Link>



        {/* Database Visualizer */}
        <Link
          href={dbVizLink}
          className={`flex flex-row items-center gap-2 p-2 rounded-sm transition-all duration-300 ease-in-out ${
            isActive('/database-visualizer') ? 'bg-slate-400 text-white' : 'bg-transparent text-gray-700 hover:bg-slate-200'
          }`}
        >
          <RiDatabaseLine size={20} />
          <p>Database Visualizer</p>
        </Link>
                {/* Help */}
                <Link
          href={helpLink}
          className={`flex flex-row items-center gap-2 p-2 rounded-sm transition-all duration-300 ease-in-out ${
            isActive('/help') ? 'bg-slate-400 text-white' : 'bg-transparent text-gray-700 hover:bg-slate-200'
          }`}
        >
          <RiQuestionLine size={20} />
          <p>Help</p>
        </Link>
      </div>

      {/* <ConversationHistory /> */}
      <footer
        className={`w-full flex flex-row ${!hasUserGivenName && 'justify-center'}`}
      >
        <UserButton
          afterSignOutUrl="/sign-in"
          showName={Boolean(hasUserGivenName)}
          appearance={{
            elements: { userButtonBox: 'flex-row-reverse' },
          }}
        />
      </footer>
    </aside>
  );
}
