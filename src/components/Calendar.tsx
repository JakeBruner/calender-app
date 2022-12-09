import classnames from "classnames";
import { useEffect, useState, useCallback } from "react";
import type { SelectedRange, /*Day*/ } from "../types/calendar";
import React from "react";

// model Booking {
//   id          String   @id @default(cuid())
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
//   start       DateTime
//   end         DateTime
//   title       String
//   message     String?
//   approved    Boolean  @default(false)
//   draft       Boolean  @default(false)
//   author      User     @relation(fields: [authorId], references: [id])
//   authorId    String
//   sharedUsers User[]   @relation("SharedBookings")
// }

const testBookings = [
  {
    id: "1",
    start: new Date(2021, 8, 1),
    end: new Date(2021, 8, 3),
    title: "Test Booking 1",
    message: "Test Message 1",
    approved: true,
    draft: false,
  },
  {
    id: "2",
    start: new Date(2021, 8, 3),
    end: new Date(2021, 8, 5),
    title: "Test Booking 2",
    message: "Test Message 2",
    approved: true,
    draft: false,
  },
  {
    id: "3",
    start: new Date(2021, 8, 5),
    end: new Date(2021, 8, 7),
    title: "Test Booking 3",
    message: "Test Message 3",
    approved: true,
    draft: false,
  },
];

type Booking = typeof testBookings[0];
// wrapped means the day occurs on a monday and the booking title should write itself again
// type BookingsPerDay = (Booking[] & { first?: boolean; wrapped?: boolean }) | null;
interface BookingsPerDay {
  bookings: Booking[] | null;
  first?: boolean;
  wrapped?: boolean;
}

interface Day {
  date: Date;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  bookings?: BookingsPerDay;
}

type DayAndBookings = Day & BookingsPerDay;


interface DayProps {
  day: Day;
  isItToday: boolean;
  isSelected: boolean;
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
            "cursor-default pointer-events-none select-none"
        )}
      >
        {day.date.getDate()}
      </time>
    </div>
  );
};

const MemoizedDesktopDay = React.memo(DesktopDay);

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
          isSelected && "flex h-6 w-6 items-center justify-center rounded-full",
          isSelected && isItToday && "bg-sky-600",
          isSelected && !isItToday && "bg-green-700/70",
          "ml-auto cursor-default pointer-events-none select-none"
        )}
      >
        {day.date.getDate()}
      </time>
      </div>
      <span className="sr-only">{day.date.getDate()} events</span>
    </div>
  );
};

const MemoizedMobileDay = React.memo(MobileDay);

interface CalendarProps {
  selectedRange: SelectedRange;
  setSelectedRange: React.Dispatch<React.SetStateAction<SelectedRange>>;
  selectedMonth: number;
  selectedYear: number;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedRange,
  setSelectedRange,
  selectedMonth,
  selectedYear,
}) => {
  const [moreRows, setMoreRows] = useState(false);

  const [days, setDays] = useState<Day[]>([]);

  // const isDateToday = (date: Date): boolean =>
  //   date.getFullYear() === today.getFullYear() &&
  //   date.getMonth() === today.getMonth() &&
  //   date.getDate() === today.getDate();

  // const [daysBookings, daysBookings] = useState<BookingsPerCalenderDay[]>(testBookings);
  //! I will just select * from Bookings and filter them in the frontend
  //! this shouldn't be an issue (and maybe even better) because the amount is limited
  //! then it will just be one query instead of one query per month

  //* BOOKINGS HELPER 
  const getBookingsForDay = (day: Date): BookingsPerDay => {
    // first means day is the start of a booking
    let first = false;
    // wrapped means day is on a monday, and title should rewrite
    let wrapped = false;

    const bookings = testBookings.filter((booking) => {
      // if in range
      if (booking.start.toDateString() === day.toDateString()) {
        first = true;
        return true;
      }
      
      if (booking.start && booking.end) {
        return (
          day >= booking.start &&
          day <= booking.end 
        );
      }
    });

    day.getDay() === 1 && bookings.length > 0 && (wrapped = true);

    return { bookings, first, wrapped };
  };


  const populateDaysAndBookings = useCallback(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const today = new Date();
    // create an array of days from 1 to the last day in the month
    const _days: DayAndBookings[] = Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    ).map((dayNumber) => {
      const date = new Date(selectedYear, selectedMonth, dayNumber);
      const isCurrentMonth = date.getMonth() === selectedMonth;
      const isToday = date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

      const { bookings, first, wrapped} = getBookingsForDay(date);
  
      return {
        date,
        isCurrentMonth,
        isToday,
        bookings: (bookings.length > 0 ? bookings : null),
        first,
        wrapped,
      };
    });

  
    // add empty placeholders for the first few days so that the 1st always falls on the correct day of the week
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

    const numberOfPlaceholders =
      firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < numberOfPlaceholders; i++) {
      const date = new Date(selectedYear, selectedMonth, -i);
      const {bookings, first, wrapped } = getBookingsForDay(date);

      _days.unshift({
        date,
        isCurrentMonth: false,
        isToday: false,
        bookings: (bookings.length > 0 ? bookings : null),
        first,
        wrapped,
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
  
    // check if needs more rows
    if (_days.length > 35) {
      setMoreRows(true);
    } else {
      setMoreRows(false);
    }
  
    setDays(_days);
  }, [selectedMonth, selectedYear, testBookings]);

  useEffect(() => {
    populateDaysAndBookings();
  }, [populateDaysAndBookings]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRange([null, null]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRange, setSelectedRange]);


  // populate the array of calendar days with a dependency on the current month and year
  // useEffect(() => {
  //   const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  //   // create an array of days from 1 to the last day in the month
  //   const _days: Day[] = Array.from(
  //     { length: daysInMonth },
  //     (_, i) => i + 1
  //   ).map((dayNumber) => {
  //     const date = new Date(selectedYear, selectedMonth, dayNumber);
  //     const isCurrentMonth = date.getMonth() === selectedMonth;
      
  //     return {
  //       date,
  //       isCurrentMonth,
  //       // isToday,
  //       // isSelected,
  //     };
  //   });

  //   // add empty placeholders for the first few days so that the 1st always falls on the correct day of the week
  //   const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  //   const numberOfPlaceholders =
  //     firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  //   for (let i = 0; i < numberOfPlaceholders; i++) {
  //     _days.unshift({
  //       date: new Date(selectedYear, selectedMonth, -i),
  //     });
  //   }

  //   // add empty placeholders for the last few days so that the last day always falls on a Saturday
  //   const lastDayOfMonth = new Date(
  //     selectedYear,
  //     selectedMonth + 1,
  //     0
  //   ).getDay();
  //   const numberOfPlaceholdersAtEnd =
  //     lastDayOfMonth === 7 ? 0 : 7 - lastDayOfMonth;
  //   for (let i = 0; i < numberOfPlaceholdersAtEnd; i++) {
  //     _days.push({
  //       date: new Date(selectedYear, selectedMonth + 1, i + 1),
  //     });
  //   }

  //   // check if needs more rows
  //   if (_days.length > 35) {
  //     setMoreRows(true);
  //   } else {
  //     setMoreRows(false);
  //   }

  //   setDays(_days);
  // }, [selectedMonth, selectedYear]);

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
            const isItToday = isDateToday(day.date);
            const isSelected = isInRange(day.date);
            // console.log(isSelected)
            return (
              <MemoizedMobileDay
                key={day.date.toDateString()}
                day={day}
                isItToday={isItToday}
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
