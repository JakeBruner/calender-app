import { useState } from "react";
import CalendarWrapper from "../../components/CalendarWrapper";
// import { trpc } from "../../utils/trpc";

import type { Booking } from "../../../src/types/calendar";

const testBookings: Booking[] = [
  {
    id: "1",
    start: new Date(2022, 11, 1),
    end: new Date(2022, 11, 3),
    title: "Test Booking 1",
    message: "Test Message 1 this is a long message that is very long and very wordy and is very good at demonstrating how this user-interface will look when it is used by a user.",
    location: "L1",
		author: {
      id: "1",
      name: "Author 1",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    sharedUsers: [],
  },
  {
    id: "2",
    start: new Date(2022,11, 3),
    end: new Date(2022, 11, 5),
    title: "Test Booking 2",
    message: "Test Message 2",
    location: "L2",
		author: {
      id: "2",
      name: "Author 2",
      image: null
    },
    sharedUsers: [],
  },
  {
    id: "3",
    start: new Date(2022, 11, 5),
    end: new Date(2022, 11, 7),
    title: "Test Booking 3",
    message: "Test Message 3",
    location: "L3",
		author: {
      id: "3",
      name: "Author 3",
      image: null
    },
    sharedUsers: [],
  },
];


export default function CalendarApp(): JSX.Element {

  // const bookings = trpc.bookings.getAll.useQuery();
 
  const [bookings, setBookings] = useState<Booking[]>(testBookings);

  

  return (

    <CalendarWrapper bookings={bookings}/>

  );
}