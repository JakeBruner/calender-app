/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from "react";
import classnames from "classnames";

import type { Day, DayWithBookingInfo, BookingID } from "../types/calendar";


import { locations } from "../types/location";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

// import { useRef, useEffect, useCallback, useState } from "react";

export type DayProps = {
  day: Day 
  isItToday: boolean;
  isSelected: boolean;
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
  cellWidth: number;
}

type BookingProps = {
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
  cellWidth: number;
  date: Date;
}

const BookingLine: React.FC<BookingProps> = ({ bookings, setSelectedBooking, cellWidth, date }) => {
  // console.log("Booking component: ", bookings)
  

  return (
    <>
      {bookings?.map((booking) => {
      // if (!(booking.isMonday && date.getDay() === 1) && !(booking.start.toUTCString().split("T")[0] === date.toUTCString().split("T")[0])) {
      //   return null;
      // } //* this check is implied
      const oneDayBooking = booking.start.toUTCString().split("T")[0] === booking.end.toUTCString().split("T")[0];
      const daysTillSunday = 7 - date.getDay();


      const bookingWidth = oneDayBooking ? cellWidth - 2 + "px" : 
      (booking.end.getTime() - booking.start.getTime()) / (1000 * 60 * 60 * 24) * cellWidth - 2 + "px";
        
        // (booking.end.getTime() - booking.start.getTime()) / (1000 * 60 * 60 * 24) * cellWidth - 2 + "px";
       
      if (booking.isStart){

        
        
      
        return (
          <button key={booking.id} className={classnames("h-4 z-10 rounded-sm", `bg-${locations[booking.location].color}-500`,
          "hover:scale-[101%] hover:shadow-lg transition-all duration-200 ease-in-out select-none ml-0.5 w-full"
          )}
            style={{width: `${bookingWidth}`}}
            onClick={() => 
              setSelectedBooking(booking.id)}
          >
            <div className={classnames("pl-1 -translate-y-1 text-left whitespace-nowrap overflow-clip", `text-${locations[booking.location].color}-100`)}>
            {booking.title} <ChevronRightIcon className="inline -mx-0.5 h-3 w-3"/> {booking.author}
              </div>
          </button>
        );
      } else if (booking.isMonday && date.toUTCString().split("T")[0] === booking.start.toUTCString().split("T")[0]) {
        const same = booking.start.toUTCString().split("T")[0] === booking.end.toUTCString().split("T")[0];
        const bookingWidth = same ? (cellWidth - 2) + "px" : (booking.end.getTime() - booking.start.getTime()) / (1000 * 60 * 60 * 24) * cellWidth - 2 + "px";

        return (
          <button key={booking.id} className={classnames("h-4 z-10 rounded-sm", `bg-${locations[booking.location].color}-500`,
          "hover:scale-[101%] hover:shadow-lg transition-all duration-200 ease-in-out select-none ml-0.5 w-full"
          )}
            style={{width: `${bookingWidth}`}}
            onClick={() => 
              setSelectedBooking(booking.id)}
          >
            <div className={classnames("pl-1 -translate-y-1 text-left whitespace-nowrap overflow-clip", `text-${locations[booking.location].color}-100`)}>
            {booking.title} <ChevronRightIcon className="inline -mx-0.5 h-3 w-3"/> {booking.author}
              </div>
          </button>
        );
      } else {
        return null;
      }
   })}
   </>
   )
};


const DesktopDay: React.FC<DayProps> = ({ day, isItToday, isSelected, bookings, setSelectedBooking, cellWidth }) => {
  // console.log("Day component: ", bookings)

  const isInBooking = bookings?.some((booking) => day.date >= booking.start && day.date <= booking.end);
  //TODO This is defininetly not the best way to do this...

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
      {isInBooking &&
      <div className="relative"><BookingLine bookings={bookings} setSelectedBooking={setSelectedBooking} cellWidth={cellWidth} date={day.date} /></div>
      }
    </div>
  );
};

export const MemoizedDesktopDay = React.memo(DesktopDay);

// Day component that displays the day number and applies styling if it is in the selected range
const MobileDay: React.FC<DayProps> = ({ day, isItToday, isSelected, bookings, setSelectedBooking, cellWidth }) => {

  const isInBooking = bookings?.some((booking) => day.date >= booking.start && day.date <= booking.end);

  return (
    <div className="relative">
      <div
        id={day.date.toDateString()}
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
        <div 
        id={day.date.toDateString()}
          >
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
            {day.date.getDate()}
          </time>
        </div>
        <span className="sr-only">{day.date.getDate()} bookings</span>
      </div>
      <div className="absolute top-0 mt-6 z-20">
      {isInBooking && 
        <div className="relative">
          <BookingLine bookings={bookings} setSelectedBooking={setSelectedBooking} cellWidth={cellWidth} date={day.date} />
        </div>
        }
        </div>
    </div>
  );
};

export const MemoizedMobileDay = React.memo(MobileDay);

