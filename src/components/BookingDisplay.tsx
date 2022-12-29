import { type FC, useEffect, useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import type { Booking } from "../types/calendar";

type ModifiedBooking = Omit<Booking, "author" | "location" | "id"> & {
  location: LocationFull;
};

import { locations, locationsList } from "../types/location";
type LocationFull = typeof locationsList[number];

import { ArrowsRightLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import classnames from "classnames";

import type { BookingID } from "../types/calendar";

import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import LocationDropdown from "./LocationDropdown";



type BookingDisplayProps = {
  selectedBookingInfo: Booking | null;
  setSelectedBooking: (booking: BookingID | null) => void;
};

export const BookingDisplay: FC<BookingDisplayProps> = ({
  selectedBookingInfo,
  setSelectedBooking,
}) => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!selectedBookingInfo);
  }, [selectedBookingInfo]);

  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session && selectedBookingInfo) {
      setIsEditable(
        session.user.id === selectedBookingInfo.author.id
      );
    }
  }, [session, selectedBookingInfo]);

  const [modifiedBooking, setModifiedBooking] = useState<ModifiedBooking | null>(null);

  const setModifiedBookingLocation = (location: LocationFull) => {
    setModifiedBooking((prev) => {
      if (!prev) return null;
      return { ...prev, location };
    });
  };

  const setModifiedDateRange = (start: Date, end: Date) => {
    setModifiedBooking((prev) => {
      if (!prev) return null;
      return { ...prev, start, end };
    });
  };

  useEffect(() => {
    if (selectedBookingInfo && !modifiedBooking && isEditable) {
      setModifiedBooking({
        ...selectedBookingInfo,
        location: locationsList.find(
          (l) => l.id === selectedBookingInfo.location
        ) as LocationFull,
      });
    }
  }, [selectedBookingInfo, modifiedBooking, isEditable]);


  if (!selectedBookingInfo) {
    return null;
  }

  const dateStrings = [
    selectedBookingInfo.start.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    selectedBookingInfo.end.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  ];

  // to future self -- transiiton cannot run on leave because setSelectBooking is called before the transition is complete
  // console.log(selectedBookingInfo)
  return (
    
    <Transition
      show={open}
      className="relative m-5 rounded-lg bg-white shadow lg:m-8 lg:rounded-xl"
      enter="transition ease-out duration-200"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-200"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div className="px-4 py-5 sm:px-6">
        <h3 className="inline text-lg font-medium leading-6 text-gray-900">
          {isEditing ? (

            <input
              type="text"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Title"
              value={modifiedBooking?.title || selectedBookingInfo.title}
              onChange={(e) => {
                setModifiedBooking((prev) => {
                  if (!prev) return null;
                  return { ...prev, title: e.target.value };
                });
              }}
            />

          ) : (modifiedBooking?.title || selectedBookingInfo.title)}
        </h3>
        {isEditable && (
          <div className="inline-flex pl-4">
            <button
              type="button"
              className="text-sm font-medium text-sky-600 hover:text-sky-500"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        )}

        {/* X-mark button */}
        <div className="absolute top-0 right-0 pt-5 pr-6">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => {
              setOpen(false);
              setSelectedBooking(null);
            }}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Name{isEditable ? "hi" : "bye"}
            </dt>
            <dd
              className={classnames(
                "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                selectedBookingInfo?.author?.image && "flex items-center"
              )}
            >
              {selectedBookingInfo?.author?.name || "Anonymous"}
              {selectedBookingInfo?.author?.image && (
                <Image
                  src={selectedBookingInfo.author.image}
                  width={40}
                  height={40}
                  className="-my-2 ml-auto mr-4 inline-block -translate-y-2 rounded-full sm:translate-y-0"
                  alt="avatar"
                />
              )}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dates</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {dateStrings[0]}
              <ArrowsRightLeftIcon
                className="mx-2 inline-block h-4 w-4 text-gray-500"
                aria-hidden="true"
              />
              {dateStrings[1]}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                { (isEditing && modifiedBooking) ? (
                  <LocationDropdown selectedLocation={modifiedBooking.location} setSelectedLocation={setModifiedBookingLocation} />
                ) : (
                selectedBookingInfo?.location &&
                  locations[selectedBookingInfo.location].name)
                }
              </dd>
          </div>

          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              { isEditing && modifiedBooking ? (
                <textarea
                  className="rounded-md w-full border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="Description"
                  value={modifiedBooking?.message || selectedBookingInfo.message || ""}
                  onChange={(e) => {
                    setModifiedBooking((prev) => {
                      if (!prev) return null;
                      return { ...prev, message: e.target.value };
                    });
                  }}
                />
              ) : (
                selectedBookingInfo.message || (
                <span className="text-neutral-400">No description</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </Transition>
  );
};

export default BookingDisplay;
