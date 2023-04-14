import type { DayWithBookingInfo, BookingID } from "../types/calendar";
import { locations } from "../types/location";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import type { FC } from "react";

import classnames from "classnames";

type BookingProps = {
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
  cellWidth: number;
  date: Date;
};

const BookingLine: FC<BookingProps> = ({
  bookings,
  setSelectedBooking,
  cellWidth,
  date,
}) => {
  // TODO I think some sort of setState passed down to this would work to compute whether bookings need to be shifted to make space for one another
  // TODO I also realize I dont have a consistent system of indexing days and dates...
  return (
    <>
      {bookings?.map((booking) => {
        let bookingWidth = "";

        let overflowingEnd = false;
        let overflowingStart = false;

        const isAContinuation =
          booking.start.toISOString().split("T")[0] !==
          date.toISOString().split("T")[0];

        if (!isAContinuation) {
          //* IS NOT A CONTINUATION
          const singleDayBooking =
            booking.start.toISOString().split("T")[0] ===
            booking.end.toISOString().split("T")[0];

          const numberOfDays = singleDayBooking
            ? 1
            : (booking.end.getTime() - booking.start.getTime()) /
                (1000 * 60 * 60 * 24) +
              1; // inclusive

          const daysTillSunday =
            booking.start.getDay() === 0 ? 0 : 7 - booking.start.getDay(); // not inclusive

          if (daysTillSunday < numberOfDays) {
            overflowingEnd = true;
            bookingWidth = (daysTillSunday + 1) * cellWidth - 2 + "px"; // +1 because daysTillSunday is not inclusive
          } else {
            bookingWidth = numberOfDays * cellWidth - 2 + "px";
          }
        } else {
          //* IS A CONTINUATION
          overflowingStart = true;

          const daysTillSunday = date.getDay() === 0 ? 0 : 7 - date.getDay(); // not inclusive

          const remainingDays =
            (booking.end.getTime() - date.getTime()) / (1000 * 60 * 60 * 24); // NOT inclusive

          if (daysTillSunday < remainingDays) {
            // if the booking needs to be cut off once more
            overflowingEnd = true;
            bookingWidth = (daysTillSunday + 1) * cellWidth + 3 + "px"; // +1 because daysTillSunday is not inclusive
          } else {
            // check if the booking is a single day
            const singleDayBooking =
              booking.start.toISOString().split("T")[0] ===
              booking.end.toISOString().split("T")[0];
            if (singleDayBooking) {
              bookingWidth = cellWidth - 2 + "px";
            } else {
              bookingWidth = (remainingDays + 1) * cellWidth - 2 + "px"; // +1 because remainingDays is not inclusive
            }
          }
        }

        return (
          <button
            key={booking.id}
            className={classnames(
              "z-10 h-3 md:h-4 rounded-sm",
              `bg-${locations[booking.location].color}-500 opacity-60`,
              overflowingEnd && "rounded-r-none border-r-2 border-neutral-600",
              overflowingStart &&
                "rounded-l-none border-l-2 border-neutral-600",
              !overflowingEnd && !overflowingStart && "mx-0.5",
              "-translate-y-1.5 sm:-translate-y-1 md:translate-y-0.5 transform",
              "w-full select-none transition-all duration-200 ease-in-out hover:scale-[101%] hover:shadow-lg"
            )}
            style={{ width: `${bookingWidth}` }}
            onClick={() => setSelectedBooking(booking.id)}
          >
            <div
              className={classnames(
                "-translate-y-0.5 overflow-clip whitespace-nowrap pl-0.5 md:pl-1 text-left text-xs md:text-sm",
                `text-${locations[booking.location].color}-100`
              )}
            >
              {isAContinuation ? (
                booking.title
              ) : (
                <>
                  {booking.title}
                  <ChevronRightIcon className="mx-0.5 inline h-4 -translate-y-0.5" />
                  {booking.author}
                </>
              )}
            </div>
          </button>
        );
      })}
    </>
  );
};

export default BookingLine;
