import React from "react";
import classnames from "classnames";

import type { Day, DayWithBookingInfo } from "../types/calendar";

export type DayProps = {
  day: Day;
  isItToday: boolean;
  isSelected: boolean;
  bookings?: DayWithBookingInfo[];
}

const DesktopDay: React.FC<DayProps> = ({ day, isItToday, isSelected }) => {
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
    </div>
  );
};

export const MemoizedDesktopDay = React.memo(DesktopDay);

// Day component that displays the day number and applies styling if it is in the selected range
const MobileDay: React.FC<DayProps> = ({ day, isItToday, isSelected }) => {
  return (
    <div
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
          {day.date.getDate()}
        </time>
      </div>
      <span className="sr-only">{day.date.getDate()} events</span>
    </div>
  );
};

export const MemoizedMobileDay = React.memo(MobileDay);