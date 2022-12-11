import classnames from "classnames";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { SelectedRange /*Day*/ } from "../types/calendar";
import React from "react";

import type { Day } from "../types/calendar";

import { MemoizedDesktopDay, MemoizedMobileDay } from "./Days";

import type { Booking, DayWithBookingInfo } from "../types/calendar"

interface CalendarProps {
  selectedRange: SelectedRange;
  setSelectedRange: React.Dispatch<React.SetStateAction<SelectedRange>>;
  selectedMonth: number;
  selectedYear: number;
  bookings: Booking[];
}



export const Calendar: React.FC<CalendarProps> = ({
  selectedRange,
  setSelectedRange,
  selectedMonth,
  selectedYear,
  bookings,
}) => {

  const [moreRows, setMoreRows] = useState(false);

  const [days, setDays] = useState<Day[]>([]);


	/* useMemo hook is used to memoize the computation of days in the month. 
    useCallback memoizes this populateDays function, which sets setDays() to the computed array of days. 
    The useEffect hook is used to call the populateDays function when the component is rendered. 
    These hooks are used to avoid unnecessary recalculations. */

const computeDays = useMemo(() => {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const today = new Date();
  // create an array of days from 1 to the last day in the month
  const _days: Day[] = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  ).map((dayNumber) => {
    const date = new Date(selectedYear, selectedMonth, dayNumber);
    const isCurrentMonth = date.getMonth() === selectedMonth;
    const isToday = date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

    return {
      date,
      isCurrentMonth,
      isToday,
    };
  });


  // add empty placeholders for the first few days so that the 1st always falls on the correct day of the week
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const numberOfPlaceholders =
    firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  for (let i = 0; i < numberOfPlaceholders; i++) {
    _days.unshift({
      date: new Date(selectedYear, selectedMonth, -i),
    });
  }

  // add empty placeholders for the last few days so that the last day always falls on a Saturday
  const lastDayOfMonth = new Date(
    selectedYear,
    selectedMonth + 1,
    0
  ).getDay();
  const numberOfPlaceholdersAtEnd =
    lastDayOfMonth === 7 ? 0 : 7 - lastDayOfMonth;
  for (let i = 0; i < numberOfPlaceholdersAtEnd; i++) {
    _days.push({
      date: new Date(selectedYear, selectedMonth + 1, i + 1),
    });
  }

  return _days;
}, [selectedMonth, selectedYear]); // dependencies

	// this prevents useEffect infinite loop and unnecessary re-computations
  const populateDays = useCallback(() => {
    const days = computeDays;
		setDays(days);
		setMoreRows(days.length > 35);
  }, [computeDays]);

	// finally, useEffect is used to call populateDays when the component is rendered
  useEffect(() => {
    populateDays();
  }, [populateDays]);
	//! end nonsense


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRange([null, null]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRange, setSelectedRange]);

  const handleClick = (event: React.MouseEvent) => {
    // console.log(event.target);
    if (event.target instanceof HTMLDivElement) {
      // Get the selected day's id value
      if (!event.target.id) return;
      if (event.target.id === selectedRange[0]?.getDate().toString()) {
        setSelectedRange([null, null]);
        return;
      }
      if (
        selectedMonth === selectedRange[0]?.getMonth() &&
        selectedYear === selectedRange[0].getFullYear() &&
        parseInt(event.target.id, 10) < selectedRange[0]?.getDate()
      ) {
        setSelectedRange([null, null]);
        return;
      }
      if (!selectedRange[0]) {
        const selectedDayId = parseInt(event.target.id, 10);

        // Use the mapping function to convert the selected day's id into a Date object
        const selectedDate = idToDate(selectedDayId);
        // Update the selected day state variable with the Date object
        setSelectedRange([selectedDate, null]);
      }
      if (selectedRange[0] && !selectedRange[1]) {
        const selectedDayId = parseInt(event.target.id, 10);

        // Use the mapping function to convert the selected day's id into a Date object
        const selectedDate = idToDate(selectedDayId);

        // Update the selected day state variable with the Date object
        setSelectedRange([selectedRange[0], selectedDate]);
      }
      if (selectedRange[0] && selectedRange[1]) {
        setSelectedRange([null, null]);
      }
    }
  };

  // helper functions for interacting with the calendar
  const idToDate = (id: number) => new Date(selectedYear, selectedMonth, id);

  const isInRange = (date: Date) => {
    // if only one date is selected, return true if the date is the same as the selected date
    if (!selectedRange[0] && !selectedRange[1]) return false;
    if (!selectedRange[1])
      return date.toDateString() === selectedRange[0]?.toDateString();
    if (!selectedRange[0]) return false;
    return date >= selectedRange[0] && date <= selectedRange[1];
  };

  const getDayFromBookings = (day: Date): DayWithBookingInfo[] | null => {

    if (bookings.length === 0) return null;
    const _bookinginfo: DayWithBookingInfo[] = [];
    bookings.forEach((b) => {
      if (b.start === day) {
        _bookinginfo.push({
          id: b.id,
          title: b.title,
          author: b.author.name,
          isStart: true,
          isEnd: false,
          isMonday: day.getDay() === 1,
        });
      }
      if (b.end === day) {
        _bookinginfo.push({
          id: b.id,
          title: b.title,
          author: b.author?.name,
          isStart: false,
          isEnd: true,
          isMonday: day.getDay() === 1,
        });
      }
      if (b.start < day && b.end > day) {
        _bookinginfo.push({
          id: b.id,
          title: b.title,
          author: b.author?.name,
          isStart: false,
          isEnd: false,
          isMonday: day.getDay() === 1,
        });
      }
    });

    if (_bookinginfo.length === 0) return null;
    
    return _bookinginfo;
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-px border-b border-neutral-300 bg-neutral-200 text-center text-xs font-semibold leading-6 text-neutral-700 lg:flex-none">
        <div className="bg-white py-2">
          M<span className="sr-only sm:not-sr-only">on</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">ue</span>
        </div>
        <div className="bg-white py-2">
          W<span className="sr-only sm:not-sr-only">ed</span>
        </div>
        <div className="bg-white py-2">
          T<span className="sr-only sm:not-sr-only">hu</span>
        </div>
        <div className="bg-white py-2">
          F<span className="sr-only sm:not-sr-only">ri</span>
        </div>
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">at</span>
        </div>
        <div className="bg-white py-2">
          S<span className="sr-only sm:not-sr-only">un</span>
        </div>
      </div>
      {/* DESKTOP CALENDER */}
      <div className="flex bg-neutral-200 text-xs leading-6 text-neutral-700 lg:flex-auto">
        <div
          className={classnames(
            moreRows ? "lg:grid-rows-6" : "lg:grid-rows-5",
            "hidden w-full lg:grid lg:grid-cols-7 lg:gap-px"
          )}
          onClick={handleClick}
        >
          {days.map((day) => {
            const isSelected = isInRange(day.date);
            // check if day is in range of BookingDates
            



            return (
              <MemoizedDesktopDay
                key={day.date.toDateString()}
                day={day}
                isItToday={day.isToday || false}
                isSelected={isSelected}
              />
            );
          })}
        </div>

        {/* MOBILE CALENDER */}
        <div
          className={classnames(
            moreRows ? "grid-rows-6" : "grid-rows-5",
            "isolate grid w-full grid-cols-7 gap-px lg:hidden"
          )}
          onClick={handleClick}
        >
          {days.map((day) => {
            const isSelected = isInRange(day.date);
            // console.log(isSelected)
            return (
              <MemoizedMobileDay
                key={day.date.toDateString()}
                day={day}
                isItToday={day.isToday || false}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Calendar;
