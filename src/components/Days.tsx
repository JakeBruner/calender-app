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
}


// Day component that displays the day number and applies styling if it is in the selected range
const DayComponent: FC<DayProps> = ({ day, isItToday, isSelected, bookings, setSelectedBooking, cellWidth }) => {

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

export const MemoizedDay = memo(DayComponent);
export default MemoizedDay;

