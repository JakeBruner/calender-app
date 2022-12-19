import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import classnames from "classnames";
import { Tab } from '@headlessui/react'
import Table from "../../components/admin/Table";
import { useState } from "react";
import { Fragment } from "react";


export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const tabs = ["General", "Approve Users", "Approve Bookings"]


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
      <div className="pb-8">
        <h1 className="font-semibold text-5xl">Admin Panel</h1>
      </div>
      <div className="flex flex-col">
        <Tab.Group defaultIndex={0}>
          <Tab.List className="flex divide-x divide-neutral-200 rounded-lg shadow" aria-label="Tabs">
            <Tab as={Fragment}>
              {({selected}) => (
                <button
                  className={classnames(
                      selected ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700', // selected
                      'rounded-l-lg', // first tab
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-neutral-50 focus:z-10'
                    )}
                >
                  General
                  <span
                    aria-hidden="true"
                    className={classnames(
                      selected ? 'bg-sky-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5'
                    )}
                  />
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({selected}) => (
                <button
                
                  className={classnames(
                      selected ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700', // selected
                      // tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-neutral-50 focus:z-10'
                    )}
                >
                  Approve Users
                  <span
                    aria-hidden="true"
                    className={classnames(
                      selected ? 'bg-sky-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5'
                    )}
                  />
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({selected}) => (
                <button
                  className={classnames(
                      selected ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700', // selected
                      'rounded-r-lg', // last tab
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-neutral-50 focus:z-10'
                    )}
                >
                  Approve Bookings
                  <span
                    aria-hidden="true"
                    className={classnames(
                      selected ? 'bg-sky-500' : 'bg-transparent',
                      'absolute inset-x-0 bottom-0 h-0.5'
                    )}
                  />
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-10">
            <Tab.Panel>
              <div className="flex flex-col">
                Hello 
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <Table />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}