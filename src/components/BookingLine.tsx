import type { DayWithBookingInfo, BookingID } from "../types/calendar";
import { locations } from "../types/location";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import classnames from "classnames";

type BookingProps = {
  bookings: DayWithBookingInfo[] | null;
  setSelectedBooking: React.Dispatch<React.SetStateAction<BookingID | null>>;
  cellWidth: number;
  date: Date;
};

const BookingLine: React.FC<BookingProps> = ({
  bookings,
  setSelectedBooking,
  cellWidth,
  date,
}) => {
  // console.log("Booking component: ", bookings)

  //TODO I think some sort of setState passed down to this would work to compute whether bookings need to be shifted to make space for one another
  //TODO I also realize I dont have a consistent system of indexing days and dates...
  return (
    <>
      {bookings?.map((booking) => {
        let bookingWidth = "";

        let overflowingEnd = false;

        const isAContinuation =
          booking.start.toISOString().split("T")[0] !==
          date.toISOString().split("T")[0];
        // console.log("isAContinuation: ", isAContinuation);)

        // YYYY-MM-DD
        // const bookingDate: [number, number, number] = booking.start.toISOString().split("T")[0]?.split("-").map((num) => parseInt(num)) as [number, number, number];
        // const bookingEnd: [number, number, number] = booking.end.toISOString().split("T")[0]?.split("-").map((num) => parseInt(num)) as [number, number, number];
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

        // // const oneDayBooking = booking.start.toUTCString().split("T")[0] === booking.end.toUTCString().split("T")[0];
        // const oneDayBooking = bookingDate[0] === bookingEnd[0] && bookingDate[1] === bookingEnd[1] && bookingDate[2] === bookingEnd[2];

        // if ()

        // if (oneDayBooking) {
        //   bookingWidth = cellWidth - 2 + "px";
        // } else if (overflowEnd) {
        //   bookingWidth = daysTillSunday * cellWidth - 2 + "px";
        // } else {
        //   bookingWidth = (booking.end.getTime() - booking.start.getTime()) / (1000 * 60 * 60 * 24) * cellWidth - 2 + "px";
        // }

        // (booking.end.getTime() - booking.start.getTime()) / (1000 * 60 * 60 * 24) * cellWidth - 2 + "px";
        return (
          <button
            key={booking.id}
            className={classnames(
              "z-10 h-4 rounded-sm",
              `bg-${locations[booking.location].color}-500 opacity-80`,
              overflowingEnd && "rounded-r-none border-r-4 border-neutral-600",
              isAContinuation && "rounded-l-none",
              "ml-0.5 w-full select-none transition-all duration-200 ease-in-out hover:scale-[101%] hover:shadow-lg"
            )}
            style={{ width: `${bookingWidth}` }}
            onClick={() => setSelectedBooking(booking.id)}
          >
            <div
              className={classnames(
                "-translate-y-0.5 overflow-clip whitespace-nowrap pl-1 text-left text-sm",
                `text-${locations[booking.location].color}-100`
              )}
            >
              {booking.title}{" "}
              <ChevronRightIcon className="-mx-0.5 inline h-3 w-3" />{" "}
              {booking.author}
            </div>
          </button>
        );
      })}
    </>
  );
};

export default BookingLine;
