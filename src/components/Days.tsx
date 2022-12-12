/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from "react";
import classnames from "classnames";

import type { Day, DayWithBookingInfo, BookingID, Booking } from "../types/calendar";

import { locations } from "../types/location";

import { useRef, useEffect, useCallback, useState } from "react";

export type DayProps = {
  day: Day 
  isItToday: boolean;
  isSelected: boolean;
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
}

type BookingProps = {
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
}

const BookingLine: React.FC<BookingProps> = ({ bookings, setSelectedBooking }) => {
  // console.log("Booking component: ", bookings)
  
  return (
    <>
      {bookings?.map((booking) => (
        // these colors are defined in tailwind.config.js
        <button key={booking.id} className={classnames("w-full h-4 relative z-10", `bg-${locations[booking.location].color}-500`)}
          onClick={() => 
            setSelectedBooking(booking.id)}>
          {booking.isStart && <p className={classnames("-translate-y-3 absolute text-left overflow-x-auto", `text-${locations[booking.location].color}-100`)}>{booking.title} | {booking.author}</p>}
          {booking.isMonday && <p className={classnames("-translate-y-1 text-left", `text-${locations[booking.location].color}-100`)}>{booking.author}</p>}
        </button>
      ))}
  </>
  );
};


const DesktopDay: React.FC<DayProps> = ({ day, isItToday, isSelected, bookings, setSelectedBooking }) => {
  // console.log("Day component: ", bookings)


  return (
    <div
      key={day.date.toDateString()}
      id={day.date.getDate().toString()}
      className={classnames(
        day.isCurrentMonth ? "bg-white" : "bg-neutral-100",
        (isSelected || isItToday) && "font-semibold",
        isSelected && "text-white",
        !isSelected && isItToday && "text-sky-600",
        !isSelected && day.isCurrentMonth && !isItToday && "text-neutral-900",
        !isSelected && !day.isCurrentMonth && !isItToday && "text-neutral-500",
        "relative min-h-[100px] py-2 px-3 hover:bg-neutral-100"
      )}
    >
      <time
        dateTime={day.date.toDateString()}
        className={classnames(
          isSelected && "flex h-6 w-6 items-center justify-center rounded-full",
          isSelected && isItToday && "bg-sky-600",
          isSelected && !isItToday && "bg-neutral-900",
          isItToday && !isSelected
            ? "flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 font-semibold text-white"
            : undefined,
          "pointer-events-none cursor-default select-none"
        )}
      >
        {day.date.getDate()}
      </time>
      {bookings && 
      <div className="relative"><BookingLine bookings={bookings} setSelectedBooking={setSelectedBooking} /></div>
      }
    </div>
  );
};

export const MemoizedDesktopDay = React.memo(DesktopDay);

// Day component that displays the day number and applies styling if it is in the selected range
const MobileDay: React.FC<DayProps> = ({ day, isItToday, isSelected, bookings, setSelectedBooking }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { width, /*height*/ } = useResize(componentRef);
  return (
    <div
      ref={componentRef}
      id={day.date.getDate().toString()}
      className={classnames(
        day.isCurrentMonth ? "bg-white" : "bg-neutral-100",
        (isSelected || isItToday) && "font-semibold",
        isSelected && "text-white",
        !isSelected && isItToday && "text-sky-600",
        !isSelected && day.isCurrentMonth && !isItToday && "text-neutral-900",
        !isSelected && !day.isCurrentMonth && !isItToday && "text-neutral-500",
        isSelected
          ? "bg-green-50 hover:bg-green-100/60"
          : "hover:bg-neutral-100",
        "flex h-14 min-h-[70px] flex-col focus:z-10",
        "t"
      )}
    >
      <div>
        <time
          dateTime={day.date.toDateString()}
          className={classnames(
            isSelected &&
              "flex h-6 w-6 items-center justify-center rounded-full",
            isSelected && isItToday && "bg-sky-600",
            isSelected && !isItToday && "bg-green-700/70",
            "pointer-events-none ml-auto cursor-default select-none"
          )}
        >
          {day.date.getDate()}{bookings?.length}
        </time>
      </div>
      <span className="sr-only">{day.date.getDate()} bookings</span>
      {bookings && 
      <div className="relative"><BookingLine bookings={bookings} setSelectedBooking={setSelectedBooking} /></div>
      }
    </div>
  );
};

export const MemoizedMobileDay = React.memo(MobileDay);


const useResize = (myRef: React.RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState(0)
  // const [height, setHeight] = useState(0)
  
  const handleResize = useCallback(() => {
      setWidth(myRef.current!.offsetWidth)
      // setHeight(myRef.current!.offsetHeight)
  }, [myRef])

  useEffect(() => {
    window.addEventListener('load', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('load', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [myRef, handleResize])

  return { width, /*height*/ }
}