import { trpc } from "../../utils/trpc";

import type { RouterOutputs } from "../../utils/trpc";

import { CheckCircleIcon } from "@heroicons/react/20/solid";

import { Fragment, useRef, useState, useEffect, type FC } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { Session } from "next-auth";

type Booking = RouterOutputs["bookings"]["adminGetAll"][0];

import SortingSelector from "./SortingSelector";

// type sortingOptions = "Date (Ascending)" | "Date (Descending)" | "Location" | "Author"
// const enum sortingOptions {
//   "Date (Ascending)",
//   "Date (Descending)",
//   "Location",
//   "Author",
// }
// const sortingOptions = {
//   "Date (Ascending)": 0,
//   "Date (Descending)": 1,
//   "Location": 2,
//   "Author": 3,
// } opposite
export const sortingOptions = {
  // I hope nobody has to see this spaghetti code
  0: "Date (Ascending)",
  1: "Date (Descending)",
  2: "Location",
  3: "Author",
} as const;
export const sortingOptionsArray = [0, 1, 2, 3] as const;

export type sortingNumbers = keyof typeof sortingOptions;

// Location in form L1, L2, L3, L4, Other
// sorting function for comparison
import type { LocationID } from "../../types/location";
import { locations } from "../../types/location";

const locationOrder = ["L1", "L2", "L3", "L4", "Other"];
const locationCompare = (a: LocationID, b: LocationID) => {
  if (a === b) return 0;
  return locationOrder.indexOf(a) - locationOrder.indexOf(b);
};

type BookingProps = {
  session: Session;
};

export const Bookings: FC<BookingProps> = ({}) => {
  // const { data: session } = useSession();

  const bookings = trpc.bookings.adminGetAll.useQuery();

  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [allowedBookings, setAllowedBookings] = useState<Booking[]>([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupBooking, setPopupBooking] = useState<{
    title: string;
    id: string;
  } | null>(null);
  const cancelButtonRef = useRef(null);

  const [sorting, setSorting] = useState<sortingNumbers>(0);

  // sorting the bookings
  useEffect(() => {
    if (bookings.data) {
      const sortedBookings = bookings.data.sort((a, b) => {
        switch (sorting) {
          case 0:
            return a.start.valueOf() - b.start.valueOf();
          case 1:
            return b.start.valueOf() - a.start.valueOf();
          case 2:
            return locationCompare(a.location, b.location);
          case 3: // alphabetical A-Z name a.author.name but can be null
            if (a.author?.name && b.author?.name) {
              return a.author.name.localeCompare(b.author.name);
            }
            return 0;
        }
      });
      setPendingBookings(
        sortedBookings.filter((booking) => booking.approved === false)
      );
      setAllowedBookings(
        sortedBookings.filter((booking) => booking.approved === true)
      );
    }
  }, [bookings.data, sorting]);

  const utils = trpc.useContext();
  const approveBooking = trpc.bookings.adminApproveBooking.useMutation({
    async onMutate(id) {
      await utils.bookings.adminGetAll.cancel();
      const previousPendingBookings = pendingBookings;
      const previousAllowedBookings = allowedBookings;

      // optimistically update the UI
      setPendingBookings(
        pendingBookings.filter((booking) => booking.id !== id)
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore prettier-ignore
      setAllowedBookings([...allowedBookings, previousPendingBookings.find((booking) => booking.id === id)]);

      // return the previous value to use in case of failure
      return { previousPendingBookings, previousAllowedBookings };
    },
    onError(err, user, ctx) {
      utils.bookings.adminGetAll.setData(
        undefined,
        ctx?.previousPendingBookings
      );
    },
    onSettled() {
      // sync the cache
      utils.users.getAllUsers.invalidate();
    },
  });
  const deleteBooking = trpc.bookings.adminDeleteBooking.useMutation({
    async onMutate(id) {
      await utils.bookings.adminGetAll.cancel();
      const previousPendingBookings = pendingBookings;
      const previousAllowedBookings = allowedBookings;

      // optimistically update the UI
      setPendingBookings(
        pendingBookings.filter((booking) => booking.id !== id)
      );
      setAllowedBookings(
        allowedBookings.filter((booking) => booking.id !== id)
      );

      // return the previous value to use in case of failure
      return { previousPendingBookings, previousAllowedBookings };
    },
    onError(err, user, ctx) {
      utils.bookings.adminGetAll.setData(
        undefined,
        ctx?.previousPendingBookings
      );
    },
    onSettled() {
      // sync the cache
      utils.bookings.adminGetAll.invalidate();
    },
  });

  // useEffect(() => {
  //   if (bookings.data) {
  //     setPendingBookings(bookings.data.filter((booking) => booking.approved === false));
  //     setAllowedBookings(bookings.data.filter((booking) => booking.approved === true));
  //   }
  // }, [bookings.data]);

  if (bookings.isLoading) {
    return <div>Loading...</div>;
  }

  if (bookings.error) {
    return <div className="text-red-500">{bookings.error.message}</div>;
  }

  // const limboUsers = users.data.filter((user) => user.role === 'LIMBO')
  // const allowedUsers = users.data.filter((user) => user.role === 'USER' || user.role === 'ADMIN')

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Bookings
            </h1>
            <p className="mt-2 text-sm text-neutral-700">
              Here you can manage all the bookings made by users as well as
              approve or delete those that are pending approval.
            </p>
          </div>
        </div>
        <div className="relative">
          <h1 className="mt-8 text-xl font-semibold text-neutral-900">
            Pending Bookings
          </h1>
          <div className="-mx-4 mt-8">
            {pendingBookings.length > 0 ? (
              <div className="mx-auto w-full overflow-x-auto py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-y-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="relative mx-auto w-full divide-y divide-neutral-300">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                          >
                            Author
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                          >
                            Start
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                          >
                            End
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {pendingBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                              {booking.title}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                              {booking.author?.name || booking.author.id}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                              {locations[booking.location].name.split(" ")[0]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                              {booking.start.toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                              {booking.end.toLocaleDateString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                className="mr-5 text-sky-600 hover:text-sky-900"
                                onClick={() => {
                                  approveBooking.mutate(booking.id);
                                }}
                              >
                                Approve
                                <span className="sr-only">, {booking.title}</span>
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => {
                                  setPopupBooking(booking);
                                  setShowPopup(true);
                                }}
                              >
                                Delete
                                <span className="sr-only">, {booking.title}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  <CheckCircleIcon className="h-6 w-6 text-neutral-500" />
                </div>
                <p className="mt-4 text-sm font-medium text-neutral-900">
                  No bookings to approve! 🎉
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="z-10 mt-8 flex flex-row">
            {/* I'm using self-end because of how the Pending Bookings section looks with padding */}
            <h1 className="self-end text-xl font-semibold text-neutral-900">
              Approved Bookings
            </h1>
            <div className="flex-grow" />
            {/* sorting options dropdown */}
            <div className="z-10 translate-y-2.5 self-end sm:translate-y-2">
              <SortingSelector sorting={sorting} setSorting={setSorting} />
            </div>
          </div>
          <div className="-mx-4 mt-8">
            {allowedBookings.length > 0 && (
              <div className="mx-auto w-full overflow-x-auto py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-y-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="relative mx-auto w-full divide-y divide-neutral-300">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          Author
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                        >
                          Start
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                        >
                          End
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="relative divide-neutral-200 bg-white marker:divide-y">
                      {allowedBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {booking.title}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {booking.author?.name || booking.author.id}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {locations[booking.location].name.split(" ")[0]}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                            {booking.start.toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                            {booking.end.toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap py-4 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              className="mr-5 cursor-not-allowed text-sky-600 hover:text-sky-800"
                              disabled
                            >
                              Edit
                              <span className="sr-only">, {booking.title}</span>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => {
                                setPopupBooking(booking);
                                setShowPopup(true);
                              }}
                            >
                              Delete
                              <span className="sr-only">, {booking.title}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Transition.Root show={showPopup}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex items-center justify-center min-h-screen"
          initialFocus={cancelButtonRef}
          onClose={setShowPopup}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* centered vertically and horizontally */}
          <div className=" z-10 overflow-y-auto">
            <div className="min-h-full flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="sm:max-w-lg relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-neutral-900"
                        >
                          Delete booking
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-neutral-500">
                            Are you sure you want to delete the booking titled{" "}
                            <span className="font-semibold">
                              {popupBooking?.title}
                            </span>
                            ? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setShowPopup(false);
                        popupBooking && deleteBooking.mutate(popupBooking.id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-base font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setShowPopup(false);
                      }}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Bookings;
