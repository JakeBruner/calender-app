/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classnames from "classnames";

import type { FC } from "react";
import { memo } from "react";

import type { Day, DayWithBookingInfo, BookingID } from "../types/calendar";

import BookingLine from "./BookingLine";


// import { useRef, useEffect, useCallback, useState } from "react";

export type DayProps = {
  day: Day 
  isItToday: boolean;
  isSelected: boolean;
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
  cellWidth: number;
  bookingsPerRow: number[]
}


// Day component that displays the day number and applies styling if it is in the selected range
const DayComponent: FC<DayProps> = ({ day, isItToday, isSelected, bookings, setSelectedBooking, cellWidth, bookingsPerRow }) => {

  // include if booking starts on the day or if day is monday and booking includes the day
  const filteredBookings = bookings?.filter((booking) => {
    return booking.start.toISOString().split("T")[0] === day.date.toISOString().split("T")[0] || (day.date.getDay() === 1 && booking.start < day.date && booking.end >= day.date)
  })
  // console.log(filteredBookings)


  return (
    <div className="relative">
      <div
        id={day.date.toDateString()}
        className={classnames(
          day.isCurrentMonth ? "bg-white" : "bg-neutral-100",
          day.isCurrentMonth && isSelected && "bg-sky-100/70 ring-1 ring-neutral-300 ",
          !day.isCurrentMonth && isSelected && "bg-sky-200/20",
          "flex h-14 sm:min-h-20 lg:min-h-28 flex-col focus:z-10",
        )}
      >
        <div 
          className="w-full flex"
        id={day.date.toDateString()}
          >
          <time
            
            dateTime={day.date.toDateString()}
            className={classnames(
              isSelected && "text-green-900",
              isItToday && "underline",
              "pointer-events-none cursor-default select-none ml-auto md:mr-1.5 md:mt-1 mr-1 mt-0.5 text-xs sm:text-sm lg:text-md"
            )}
          >
            {day.date.getDate()}
          </time>
        </div>
        <span className="sr-only">{day.date.getDate()} bookings</span>
      </div>
      <div className="absolute top-0 mt-6 z-20">
      {filteredBookings && 
        <div className="relative">
          <BookingLine bookings={filteredBookings} setSelectedBooking={setSelectedBooking} cellWidth={cellWidth} date={day.date} />
        </div>
        }
        </div>
    </div>
  );
};

export const MemoizedDay = memo(DayComponent);
export default MemoizedDay;

