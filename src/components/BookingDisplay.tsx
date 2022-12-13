import type { FC } from 'react';
import type { Booking } from '../types/calendar';

import { locations } from '../types/location';

type BookingDisplayProps = {
  selectedBookingInfo: Booking | null;
};

export const BookingDisplay: FC<BookingDisplayProps> = ({
  selectedBookingInfo,
}) => {

  if (!selectedBookingInfo) {
    return null;
  }

  return (
    <div>
      {/* {selectedBookingInfo && JSON.stringify(selectedBookingInfo)} */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{selectedBookingInfo.title}</h1>
        {selectedBookingInfo?.author && <p className="text-lg">{selectedBookingInfo.author.name}</p>}
        <p className="text-lg">{locations[selectedBookingInfo.location].name}</p>
        <p className="text-lg">{selectedBookingInfo.start.toDateString()}</p>
        <p className="text-lg">{selectedBookingInfo.end.toDateString()}</p>
        <p className="text-lg">{selectedBookingInfo.message}</p>
      </div>
    </div>
  );
}

export default BookingDisplay;