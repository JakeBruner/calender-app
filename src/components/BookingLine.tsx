import type { DayWithBookingInfo, BookingID } from "../types/calendar";
import { locations } from "../types/location";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import classnames from "classnames";


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

export default BookingLine;