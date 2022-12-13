import type { FC } from 'react';
import type { Booking } from '../types/calendar';

import { locations } from '../types/location';
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import classnames from 'classnames';

import { useState } from 'react';

type BookingDisplayProps = {
  selectedBookingInfo: Booking | null;
};

export const BookingDisplay: FC<BookingDisplayProps> = ({
  selectedBookingInfo,
}) => {

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


  return (
    // <div>
    //   {/* {selectedBookingInfo && JSON.stringify(selectedBookingInfo)} */}
    //   <div className="flex flex-col p-5 justify-center bg-neutral-50 rounded-lg">
    //     <div> 
    //     <h1 className="text-2xl font-bold">{selectedBookingInfo.title}</h1>
        
    //     </div>
    //     {selectedBookingInfo?.author && <p className="text-lg">{selectedBookingInfo.author.name}</p>}
    //     <p className="text-lg">{locations[selectedBookingInfo.location].name}</p>
    //     <p className="text-lg">{selectedBookingInfo.start.toDateString()}</p>
    //     <p className="text-lg">{selectedBookingInfo.end.toDateString()}</p>
    //     <p className="text-lg">{selectedBookingInfo.message}</p>
    <div className="m-5 overflow-hidden bg-white shadow sm:rounded-lg relative">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedBookingInfo.title}</h3>
        {/* X-mark button */}
        <div className="absolute top-0 right-0 pt-5 pr-6">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
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
            selectedBookingInfo.author.image && "flex items-center"
            )}>
              {selectedBookingInfo.author.name}
             {selectedBookingInfo.author.image && <Image src={selectedBookingInfo.author.image} width={40} height={40} className="rounded-full inline-block ml-auto mr-4" alt="avatar" />}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dates</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {dateStrings[0]} 
              <EllipsisHorizontalIcon className="h-5 w-5 mx-2 text-gray-500 inline-block" aria-hidden="true" />
              {dateStrings[1]}  
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{locations[selectedBookingInfo.location].name}</dd>
          </div>
          {selectedBookingInfo.message && (
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {selectedBookingInfo.message}
            </dd>
          </div>)}
          
        </dl>
      </div>
    </div>
  );
}

export default BookingDisplay;