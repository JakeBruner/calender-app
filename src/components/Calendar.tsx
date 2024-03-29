import classnames from "classnames";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useMeasure } from "react-use";

import MemoizedDay from "./Days";

import type { Booking, DayWithBookingInfo, BookingID, Day, SelectedRange } from "../types/calendar";

interface CalendarProps {
  selectedRange: SelectedRange;
  setSelectedRange: React.Dispatch<React.SetStateAction<SelectedRange>>;
  selectedMonth: number;
  selectedYear: number;
  bookings: Booking[];
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedRange,
  setSelectedRange,
  selectedMonth,
  selectedYear,
  bookings,
  setSelectedBooking,
}) => {
  const [moreRows, setMoreRows] = useState(false);

  const [days, setDays] = useState<Day[]>([]);

  /* useMemo hook is used to memoize the computation of days in the month. 
    useCallback memoizes this populateDays function, which sets setDays() to the computed array of days. 
    The useEffect hook is used to call the populateDays function when the component is rendered. 
 */

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
      const isToday =
        date.getFullYear() === today.getFullYear() &&
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
  // ! end nonsense


  const [bookingsPerRow, setBookingsPerRow] = useState<number[]>([])

  // useEffect to compute the number of bookings that fall in the range of each week row so as to compute the stacking context, i.e. how many bookings can be displayed in each row
  useEffect(() => {
    const bookingsPerRow = days.reduce((acc, day, i) => {
      if (i % 7 === 0) {
        acc.push(0);
      }
      const bookingsForDay = bookings.filter((booking) => {
        const bookingStart = new Date(booking.start);
        const bookingEnd = new Date(booking.end);
        return (
          bookingStart.getTime() <= day.date.getTime() &&
          bookingEnd.getTime() >= day.date.getTime()
        );
      });
      acc[acc.length - 1] += bookingsForDay.length;
      return acc;
    }, [] as number[]);
    setBookingsPerRow(bookingsPerRow);
  }, [days, bookings]);



  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRange([null, null]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRange, setSelectedRange]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLDivElement) {
      // Get the selected day's id value
      if (!event.target.id) return;

      const date = new Date(event.target.id);
      if (date.toString() === "Invalid Date") return;

      if (event.target.id === selectedRange[0]?.toDateString()) {
        setSelectedRange([null, null]);
        return;
      }
      if (selectedRange[0] && date.getTime() < selectedRange[0]?.getTime()) {
        setSelectedRange([null, null]);
        return;
      }
      if (!selectedRange[0]) {
        setSelectedRange([date, null]);
      }
      if (selectedRange[0] && !selectedRange[1]) {
        setSelectedRange([selectedRange[0], date]);
      }
      if (selectedRange[0] && selectedRange[1]) {
        setSelectedRange([null, null]);
      }
    }
  };

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
      /** if the month day year are the same */
      if (
        b.start.toISOString().split("T")[0] === day.toISOString().split("T")[0]
      ) {
        _bookinginfo.push({
          id: b.id,
          title: b.title,
          author: b.author.name,
          location: b.location,
          start: b.start,
          end: b.end,
          isStart: true,
          isMonday: day.getDay() === 1,
        });
      } else if (day.getDay() === 1) {
        _bookinginfo.push({
          id: b.id,
          title: b.title,
          author: b.author?.name,
          location: b.location,
          start: b.start,
          end: b.end,
          isStart: false,
          isMonday: true,
        });
      }
    });

    if (_bookinginfo.length === 0) return null;
    // console.log("bookinginfo: ", _bookinginfo)
    return _bookinginfo;
  };

  // const divElem = useRef<HTMLDivElement>(null);
  // const { width } = useComponentWidth(divElem);
  // console.log("width: ", width)

  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return (
    <>
      <div className="grid grid-cols-7 gap-px border-b border-neutral-300 bg-neutral-200 text-center text-xs font-semibold leading-6 text-neutral-700 lg:flex-none">
        <div className="bg-white py-2" ref={ref}>
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
      <div className="flex bg-neutral-200 leading-6 text-neutral-700 lg:flex-auto">
        <div
          className={classnames(
            moreRows ? "grid-rows-6" : "grid-rows-5",
            "isolate grid w-full grid-cols-7 gap-px overflow-x-clip"
          )}
          onClick={handleClick}
        >
          {days.map((day) => {
            const isSelected = isInRange(day.date);

            return (
              <MemoizedDay
                key={day.date.toDateString()}
                day={day}
                isItToday={day.isToday || false}
                isSelected={isSelected}
                bookings={getDayFromBookings(day.date)}
                setSelectedBooking={setSelectedBooking}
                cellWidth={width}
                bookingsPerRow={bookingsPerRow}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Calendar;
