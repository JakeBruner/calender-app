import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import classnames from "classnames";
import { Tab } from '@headlessui/react'
// import { Fragment } from "react";

import Bookings from "../../components/admin/Bookings";
import Users from "../../components/admin/Users";
import TabHeaderListing from "../../components/admin/TabHeaderListing"

import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";



export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();


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
    <div className="p-5 md:p-10">
      <div className="pb-8 flex flex-row">
        <h1 className="font-semibold text-2xl sm:text-3xl md:text-5xl">Admin Panel</h1>
        {/* signout button flush left */}
        <div className="flex-grow"></div>
        <Link
            href="/calendar"
            className="hidden sm:inline-flex mr-4 items-center rounded-md border border-transparent bg-sky-200 px-2 py-1 text-xs font-medium leading-4 text-sky-800 shadow-sm hover:bg-sky-300 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 lg:px-3 lg:py-2 md:text-base"
            >
            Return to Calendar
        </Link>
        <Link
            href="/calendar"
            className="inline-flex sm:hidden mr-2 sm:mr-4 items-center rounded-md border border-transparent bg-sky-200 px-2 py-1 text-xs font-medium leading-4 text-sky-800 shadow-sm hover:bg-sky-300 hover:shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 lg:px-3 lg:py-2 md:text-base"
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
      <div className="block">
        <Tab.Group defaultIndex={0}>
          <TabHeaderListing />
          <Tab.Panels className="mt-10">
            <Tab.Panel>
              <div className="flex flex-col">
                Hello! Welcome to the admin panel. Here you can approve users and bookings.
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <Users />
            </Tab.Panel>
            <Tab.Panel>
              <Bookings />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
