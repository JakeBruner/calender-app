// import type { Booking } from '../../types/calendar'
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import type { RouterOutputs } from "../../utils/trpc";

import { CheckCircleIcon } from "@heroicons/react/20/solid";

import { Fragment, useRef, useState, useEffect, type FC } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { Session } from "next-auth";

type User = RouterOutputs["users"]["getAllUsers"][0];

type UserProps = {
  session: Session;
};
export const Users: FC<UserProps> = ({ session }) => {
  const users = trpc.users.getAllUsers.useQuery();

  const [limboUsers, setLimboUsers] = useState<User[]>([]);
  const [allowedUsers, setAllowedUsers] = useState<User[]>([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupUser, setPopupUser] = useState<{
    name: string | null;
    id: string;
  } | null>(null);
  const cancelButtonRef = useRef(null);

  const utils = trpc.useContext();
  const approveUser = trpc.users.allowAccess.useMutation({
    async onMutate(id) {
      await utils.users.getAllUsers.cancel();
      const previousLimboUsers = limboUsers;
      const previousAllowedUsers = allowedUsers;

      // optimistically update the UI
      setLimboUsers(limboUsers.filter((user) => user.id !== id));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore prettier-ignore
      setAllowedUsers([...allowedUsers, limboUsers.find((user) => user.id === id)]);

      // return the previous value to use in case of failure
      return { previousLimboUsers, previousAllowedUsers };
    },
    onError(err, user, ctx) {
      utils.users.getAllUsers.setData(undefined, ctx?.previousLimboUsers);
    },
    onSettled() {
      // sync the cache
      utils.users.getAllUsers.invalidate();
    },
  });
  const deleteUser = trpc.users.deleteAccount.useMutation({
    async onMutate(id) {
      await utils.users.getAllUsers.cancel();
      const previousLimboUsers = limboUsers;
      const previousAllowedUsers = allowedUsers;

      // optimistically update the UI
      setLimboUsers(limboUsers.filter((user) => user.id !== id));
      setAllowedUsers(allowedUsers.filter((user) => user.id !== id));

      // return the previous value to use in case of failure
      return { previousLimboUsers, previousAllowedUsers };
    },
    onError(err, user, ctx) {
      utils.users.getAllUsers.setData(undefined, ctx?.previousLimboUsers);
    },
    onSettled() {
      // sync the cache
      utils.users.getAllUsers.invalidate();
    },
  });

  useEffect(() => {
    if (users.data) {
      setLimboUsers(users.data.filter((user) => user.role === "LIMBO"));
      setAllowedUsers(
        users.data.filter(
          (user) => user.role === "USER" || user.role === "ADMIN"
        )
      );
    }
  }, [users.data]);
  // useEffect is needed because the data is stateful for the optimistic updates

  if (users.isLoading) {
    return <div>Loading...</div>;
  }

  if (users.error) {
    return <div className="text-red-500">{users.error.message}</div>;
  }

  // const limboUsers = users.data.filter((user) => user.role === 'LIMBO')
  // const allowedUsers = users.data.filter((user) => user.role === 'USER' || user.role === 'ADMIN')

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
            <p className="mt-2 text-sm text-neutral-700">
              Here you can manage all users, including whether or not they have
              access to the calendar.
            </p>
          </div>
        </div>

        <div className="relative">
          <h1 className="mt-8 text-xl font-semibold text-neutral-900">
            Pending Users
          </h1>
          <div className="-mx-4 mt-8">
            {limboUsers.length > 0 ? (
              <div className="mx-auto w-full overflow-x-auto py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-y-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="relative mx-auto w-full divide-neutral-300">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          &nbsp;
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                        >
                          ID
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
                      {limboUsers.map((person) => (
                        <tr key={person.email}>
                          <td className="relative py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {person.image ? (
                              <div className="relative h-10 w-10 rounded-full">
                                <Image
                                  src={person.image}
                                  alt={person.name + "profile"}
                                  fill={true}
                                  sizes="100%"
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                                <span className="text-neutral-500">
                                  {person.name ? person.name[0] : ""}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                            {person.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                            {person.id}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              className="mr-6 text-sky-600 hover:text-sky-900"
                              onClick={() => {
                                approveUser.mutate(person.id);
                              }}
                            >
                              Approve
                              <span className="sr-only">, {person.name}</span>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                setPopupUser(person);
                                setShowPopup(true);
                              }}
                            >
                              Delete
                              <span className="sr-only">, {person.name}</span>
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
                  No users to approve
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <h1 className="mt-8 text-xl font-semibold text-neutral-900">
            Allowed Users
          </h1>
          <div className="-mx-4 mt-8">
            <div className="mx-auto w-full overflow-x-auto py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-y-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="relative mx-auto w-full divide-y divide-neutral-300">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          &nbsp;
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900"
                        >
                          ID
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
                      {allowedUsers.map((person) => (
                        <tr key={person.email}>
                          <td className="relative py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {person.image ? (
                              <div className="relative h-10 w-10 rounded-full">
                                <Image
                                  src={person.image}
                                  alt={person.name + "profile"}
                                  fill={true}
                                  className="rounded-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                                <span className="text-neutral-500">
                                  {person.name ? person.name[0] : ""}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                            {person.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">
                            {person.id}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right text-sm font-medium sm:pr-6">
                            {person.id !== session?.user.id &&
                              person.role !== "ADMIN" && (
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    // deleteUser.mutate(person.id);
                                    setPopupUser(person);
                                    setShowPopup(true);
                                  }}
                                >
                                  Delete
                                  <span className="sr-only">, {person.name}</span>
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      </div>
      <Transition.Root show={showPopup} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
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

          <div className="fixed inset-0 z-10 overflow-y-auto">
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
                          Delete account
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-neutral-500">
                            Are you sure you want to delete{" "}
                            {popupUser?.name
                              ? popupUser?.name.split(" ")[0] + "'s account"
                              : "this person's account"}
                            ? All of their data will be permanently removed.
                            This action cannot be undone.
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
                        popupUser && deleteUser.mutate(popupUser.id);
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

export default Users;
