import { type FC, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import type { Booking } from '../types/calendar';

import { locations } from '../types/location';
import { ArrowsRightLeftIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import classnames from 'classnames';

import type { BookingID } from "../types/calendar"


type BookingDisplayProps = {
  selectedBookingInfo: Booking | null;
  setSelectedBooking: (booking: BookingID | null) => void;
};


export const BookingDisplay: FC<BookingDisplayProps> = ({
  selectedBookingInfo,
  setSelectedBooking,
}) => {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!selectedBookingInfo);
  }, [selectedBookingInfo]);


  if (!selectedBookingInfo) {
    return null;
  }


  const dateStrings = [
    selectedBookingInfo.start.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    selectedBookingInfo.end.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  ];

  // to future self -- transiiton cannot run on leave because setSelectBooking is called before the transition is complete
  console.log(selectedBookingInfo)
  return (
    <Transition show={open} className="m-5 lg:m-8 overflow-hidden bg-white shadow rounded-lg lg:rounded-xl relative"
    enter="transition ease-out duration-200"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-200"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"

    >
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedBookingInfo.title}</h3>
        {/* X-mark button */}
        <div className="absolute top-0 right-0 pt-5 pr-6">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => {setOpen(false);setSelectedBooking(null)}}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className={classnames("mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0", 
            selectedBookingInfo?.author?.image && "flex items-center"
            )}>
              {selectedBookingInfo?.author?.name || "Anonymous"}
             {selectedBookingInfo?.author?.image && <Image src={selectedBookingInfo.author.image} width={40} height={40} className="rounded-full inline-block ml-auto mr-4 -translate-y-2 md:translate-y-0 -my-2" alt="avatar" />}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dates</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {dateStrings[0]} 
              <ArrowsRightLeftIcon className="h-4 w-4 mx-2 text-gray-500 inline-block" aria-hidden="true" />
              {dateStrings[1]}  
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedBookingInfo?.location && locations[selectedBookingInfo.location].name}</dd>
          </div>
          {selectedBookingInfo?.message && (
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {selectedBookingInfo.message}
            </dd>
          </div>)}
          
        </dl>
      </div>
  </Transition>
  );
}

export default BookingDisplay;