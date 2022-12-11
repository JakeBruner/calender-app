import { Fragment, useState } from "react";
import {
  // ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  // ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
// import { isToday } from 'date-fns'
import classnames from "classnames";

import Flyover from "./Flyover";
import Calendar from "./Calendar";
import Image from "next/image";

const monthNames = [
  "January",
  "February",
  "April",
  "March",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

import type { Booking } from "../types/calendar"

type CalenderWrapperProps = {
  bookings: Booking[];
};

type SelectedRange = [Date | null, Date | null];

const CalendarWrapper: React.FC<CalenderWrapperProps> = ({ bookings }) => {

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedRange, setSelectedRange] = useState<SelectedRange>([
    null,
    null,
  ]);


  const [showFlyover, setShowFlyover] = useState(false);

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <Flyover open={showFlyover} setOpen={setShowFlyover} dateRange={selectedRange} setDateRange={setSelectedRange} />
      <header className="flex relative items-center justify-between border-b border-neutral-200 py-4 px-6 lg:flex-none">
        <Image src="/logo2.png" className="absolute" width={36} height={36} alt="Logo" />
        <h1 className="text-lg font-semibold text-neutral-900 ml-12 md:ml-14">
          <time
            dateTime={`${selectedYear}-${selectedMonth
              .toString()
              .padStart(2, "0")}`}
          >
            {monthNames[selectedMonth]} {selectedYear}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-neutral-300 bg-white py-2 pl-3 pr-4 text-neutral-400 hover:text-neutral-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-50"
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-t border-b border-neutral-300 bg-white px-3.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus:relative md:block"
              onClick={() => {
                const today = new Date();
                setSelectedMonth(today.getMonth());
                setSelectedYear(today.getFullYear());
              }}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-neutral-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-neutral-300 bg-white py-2 pl-4 pr-3 text-neutral-400 hover:text-neutral-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-50"
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="ml-6 h-6 w-px bg-neutral-300" />
            <button
              type="button"
              className="ml-6 rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={() => {
                setShowFlyover(true);
              }}
            >
              Request booking
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-neutral-400 hover:text-neutral-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-neutral-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <Calendar selectedRange={selectedRange} setSelectedRange={setSelectedRange} selectedMonth={selectedMonth} selectedYear={selectedYear} bookings={bookings} />
      </div>
    </div>
  );
}

export default CalendarWrapper;