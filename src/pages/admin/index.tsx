import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import classnames from "classnames";
import { Tab, Transition } from '@headlessui/react'
// import { Fragment } from "react";
import { useState, type FC, Fragment } from "react";

import Bookings from "../../components/admin/Bookings";
import Users from "../../components/admin/Users";
import TabHeaderListing from "../../components/admin/TabHeaderListing"

import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";



export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [tabIndex, setTabIndex] = useState(0);


  if (status === "loading") {
    return (
      <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    Redirecting...
    </div>;
  }

  if (session.user.role !== "ADMIN") {
    console.log("User is not an admin")
    router.push("/");
    return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    Redirecting...
  </div>;
  }


  return (
    <>
    <div className="p-5 md:p-10">
      <div className="flex flex-row">
        <h1 className="
        font-semibold text-2xl sm:text-4xl md:text-5xl xl:text-6xl
        text-transparent bg-clip-text bg-gradient-to-br from-teal-600 via-sky-600 to-blue-600
        ">Admin Panel</h1>
        {/* signout button flush left */}
        <div className="flex-grow"></div>
        <Link
            href="/calendar"
            className="hidden sm:inline-flex mr-4 items-center rounded-md border border-transparent bg-sky-200 px-2 py-1 text-xs font-medium leading-4 text-sky-700 shadow-sm hover:bg-sky-300 hover:text-sky-800 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 lg:px-3 lg:py-2 md:text-base"
            >
            Return to Calendar
        </Link>
        <Link
            href="/calendar"
            className="inline-flex sm:hidden mr-2 sm:mr-4 items-center rounded-md border border-transparent bg-sky-200 px-2 py-1 text-xs font-medium leading-4 text-sky-700 shadow-sm hover:bg-sky-300 hover:text-sky-800 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 lg:px-3 lg:py-2 md:text-base"
            >
            Calendar
        </Link>
        <button
            className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-2 py-1 text-xs font-medium leading-4 text-white shadow-sm hover:bg-sky-700 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 lg:px-3 lg:py-2 md:text-base"
            onClick={() => { signOut() }}
            >
              <ArrowRightOnRectangleIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-white lg:h-5 lg:w-5"
            />
            Log out
        </button>
      </div>
    </div> 
    <div className="block pb-5 md:px-10 md:pb-10">
      <Tab.Group defaultIndex={0} selectedIndex={tabIndex} onChange={setTabIndex}>
        <TabHeaderListing />
        <Tab.Panels className="mt-3 sm:mt-6 md:mt-10">
          <Tab.Panel>
            <TabTransition selected={tabIndex === 0}>

                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg md:text-xl leading-6 font-medium text-gray-900">
                    Admin Dashboard
                  </h3>
                  <p className="mt-1 text-sm md:text-md text-gray-500">
                    This is the admin dashboard. Here you can manage users and bookings.
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Users
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        1,000
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Bookings
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        1,000
                      </dd>
                    </div>
                  </dl>

              </div>
            </TabTransition>
          </Tab.Panel>
          <Tab.Panel>
            <TabTransition selected={tabIndex === 1}>
              <Users session={session} />
            </TabTransition>
          </Tab.Panel>
          <Tab.Panel>
            <TabTransition selected={tabIndex === 2}>
              <Bookings session={session} />
            </TabTransition>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
    </>
  );
}

type TabTransitionProps = {
  selected: boolean;
  children: React.ReactNode;
}

const TabTransition: FC<TabTransitionProps> = ({selected, children}) => {


  return (
    <Transition appear show={selected} as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 -translate-x-5"
    enterTo="transform opacity-100 translate-x-0"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 translate-x-0"
    leaveTo="transform opacity-0 translate-x-5"
    >
      <div className="w-full h-full">
        {children}
      </div>
    </Transition>
    )

}