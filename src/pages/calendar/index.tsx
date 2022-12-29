import { useEffect, useState } from "react";
import CalendarWrapper from "../../components/CalendarWrapper";
// import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { Booking, PartialBooking } from "../../../src/types/calendar";
// import { useEffect } from "react";

import { trpc } from "../../utils/trpc";

// const testBookings: Booking[] = [
//   {
//     id: "1",
//     start: new Date(2022, 11, 1),
//     end: new Date(2022, 11, 3),
//     title: "Test Booking 1",
//     message:
//       "Test Message 1 this is a long message that is very long and very wordy and is very good at demonstrating how this user-interface will look when it is used by a user.",
//     location: "L1",
//     author: {
//       id: "1",
//       name: "Author 1",
//       image:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     },
//     sharedUsers: [],
//   },
//   {
//     id: "2",
//     start: new Date(2022, 11, 15),
//     end: new Date(2022, 11, 19),
//     title: "Test Booking 2",
//     message: "Test Message 2",
//     location: "L2",
//     author: {
//       id: "2",
//       name: "Author 2",
//       image: null,
//     },
//     sharedUsers: [],
//   },
//   {
//     id: "3",
//     start: new Date(2022, 11, 5),
//     end: new Date(2022, 11, 7),
//     title: "Test Booking 3",
//     message: "Test Message 3",
//     location: "L3",
//     author: {
//       id: "3",
//       name: "Author 3",
//       image: null,
//     },
//     sharedUsers: [],
//   },
//   {
//     id: "4",
//     start: new Date(2022, 11, 25),
//     end: new Date(2022, 11, 25),
//     title: "Test Booking 4",
//     message: "Test Message 4",
//     location: "L4",
//     author: {
//       id: "4",
//       name: "Author 4",
//       image: null,
//     },
//     sharedUsers: [],
//   },
// ];

export default function CalendarApp(): JSX.Element {
  const { status, data: session } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
    console.error("Not authenticated");
    // return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    // Redirecting...
    // </div>;
  }

  if (session?.user.role === "LIMBO") {
    router.push("/limbo");
    console.error("Not authenticated");
    // return <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
    // Redirecting...
    // </div>;
  }

  const allBookings = trpc.bookings.getAll.useQuery();

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (allBookings.status === "success") {
      setBookings(allBookings.data);
    }
  }, [allBookings]);


  const utils = trpc.useContext();

  const createBooking = trpc.bookings.create.useMutation({
    onMutate(booking) {
      if (!session) {
        return;
      }
      utils.bookings.getAll.cancel();
      const previousBookings = bookings;

      const _booking: Booking = {
        ...booking,
        id: "5",
        author: {
          id: session.user.id,
          name: session?.user.name,
          image: session?.user.image || null,
        },
      };

      // optimistically update the UI
      setBookings([...bookings, _booking]);
    
      // return the previous value to use in case of failure
      return { previousBookings };
    },
    onError(err, variables, context) {
      // if the mutation failed, use the context returned from onMutate to roll back
      context && setBookings(context.previousBookings);
    },
    onSettled() {
      // sync the cache
      utils.bookings.getAll.invalidate();
    },
  });

  const handleCreateBooking = (booking: PartialBooking) => {
    createBooking.mutate(booking);
  };

  if (allBookings.status === "loading") {
    return (
      <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  if (allBookings.status === "error") {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        Error: {allBookings.error.message}
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen animate-pulse items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }



  return (
    <main>
      <CalendarWrapper bookings={bookings} createBooking={handleCreateBooking} />
    </main>
  );
}
