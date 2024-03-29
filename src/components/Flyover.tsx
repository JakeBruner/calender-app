import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, /** CalendarIcon*/ } from '@heroicons/react/24/outline'
// import { LinkIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

import DateSelector from './DateSelector'
import type { PartialBooking } from '../types/calendar';

import { type locationsList } from '../types/location'

type Location = typeof locationsList[number]

import LocationDropdown from './LocationDropdown'

import PropTypes from 'prop-types';


interface FlyoverProps {
  dateRange: [Date | null, Date | null];
  setDateRange: (dateRange: [Date | null, Date | null]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  createBooking: (booking: PartialBooking) => void;
}



export const Flyover: React.FC<FlyoverProps> = ({dateRange, setDateRange, open, setOpen, createBooking }) => {

  const titleRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const [error, setError] = useState<string | null>(null)

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-neutral-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-sky-700 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">Request new booking</Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-sky-700 text-sky-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-sky-300">
                            Get started by filling in dates and the information below. <br/>
                            You can also select dates using the calendar on the right.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-neutral-200 px-4 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            <div>
                              <label htmlFor="project-name" className="block text-sm font-medium text-neutral-900">
                                Booking title
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="booking title"
                                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                  ref={titleRef}
                                  // onChange={e => console.log(e.target.value)}
                                ></input>
                              </div>
                            </div>
                            <div>
                              
                              <label htmlFor="description" className="pl-1 block text-sm font-medium text-neutral-900">
                                Dates
                              </label>
                              <div className="mt-1">
                              {/* <CalendarIcon className="h-5 w-5 text-neutral-400 inline-block" aria-hidden="true" /> */}

                                <DateSelector dateRange={dateRange} setDateRange={setDateRange} />

                              </div>
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-neutral-700">Location</label>
                            <LocationDropdown selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
                            </div>
                            <div>
                              <label htmlFor="description" className="block text-sm font-medium text-neutral-900">
                                Description <span className="text-neutral-400">(optional)</span>
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={4}
                                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm placeholder:text-neutral-400/80"
                                  placeholder="You can write an optional message here."
                                  ref={messageRef}
                                />
                              </div>
                            </div>
                            {/* <div>
                              <h3 className="text-sm font-medium text-neutral-900">Invite other users:</h3>
                              <div className="mt-2">
                                <div className="flex space-x-2">
                                  {team.map((person) => (
                                    <a key={person.email} href={person.href} className="rounded-full hover:opacity-75">
                                      <img
                                        className="inline-block rounded-full h-8 w-8"
                                        src={person.imageUrl}
                                        alt={person.name}
                                      />
                                    </a>
                                  ))}
                                  <button
                                    type="button"
                                    className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                  >
                                    <span className="sr-only">Add users</span>
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </div> */}
                            {/* <fieldset>
                              <legend className="text-sm font-medium text-neutral-900">Privacy</legend>
                              <div className="mt-2 space-y-5">
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-5 items-center">
                                    <input
                                      id="privacy-public"
                                      name="privacy"
                                      aria-describedby="privacy-public-description"
                                      type="radio"
                                      className="h-4 w-4 border-neutral-300 text-sky-600 focus:ring-sky-500"
                                      defaultChecked
                                    />
                                  </div>
                                  <div className="pl-7 text-sm">
                                    <label htmlFor="privacy-public" className="font-medium text-neutral-900">
                                      Public access
                                    </label>
                                    <p id="privacy-public-description" className="text-neutral-500">
                                      Everyone with the link will see this project.
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-5 items-center">
                                      <input
                                        id="privacy-private-to-project"
                                        name="privacy"
                                        aria-describedby="privacy-private-to-project-description"
                                        type="radio"
                                        className="h-4 w-4 border-neutral-300 text-sky-600 focus:ring-sky-500"
                                      />
                                    </div>
                                    <div className="pl-7 text-sm">
                                      <label htmlFor="privacy-private-to-project" className="font-medium text-neutral-900">
                                        Private to project members
                                      </label>
                                      <p id="privacy-private-to-project-description" className="text-neutral-500">
                                        Only members of this project would be able to access.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-5 items-center">
                                      <input
                                        id="privacy-private"
                                        name="privacy"
                                        aria-describedby="privacy-private-to-project-description"
                                        type="radio"
                                        className="h-4 w-4 border-neutral-300 text-sky-600 focus:ring-sky-500"
                                      />
                                    </div>
                                    <div className="pl-7 text-sm">
                                      <label htmlFor="privacy-private" className="font-medium text-neutral-900">
                                        Private to you
                                      </label>
                                      <p id="privacy-private-description" className="text-neutral-500">
                                        You are the only one able to access this project.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset> */}
                          </div>
                          <div className="pt-4 pb-6">
                            {/* <div className="flex text-sm">
                              <a
                                href="#"
                                className="group inline-flex items-center font-medium text-sky-600 hover:text-sky-900"
                              >
                                <LinkIcon
                                  className="h-5 w-5 text-sky-500 group-hover:text-sky-900"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">Copy link</span>
                              </a>
                            </div> */}
                            {/* <div className="mt-4 flex text-sm">
                              <a href="#" className="group inline-flex items-center text-neutral-500 hover:text-neutral-900">
                                <QuestionMarkCircleIcon
                                  className="h-5 w-5 text-neutral-400 group-hover:text-neutral-500"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">Learn more about sharing</span>
                              </a>
                            </div> */}

                            <Transition className="mt-4 flex text-sm"
                              show={!!error}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <div className="group inline-flex items-center text-red-500">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-400 group-hover:text-red-500"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">{error}</span>
                              </div>
                            </Transition>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        onClick={() => {
                          const title = titleRef?.current?.value;
                          console.log(title);
                          const message = messageRef?.current?.innerText;
                          if (dateRange[0] && dateRange[1] && title && selectedLocation && title.length < 20) {
                            createBooking({
                              start: dateRange[0],
                              end: dateRange[1],
                              title,
                              location: selectedLocation.id,
                              message: message || null,
                            })
                            setOpen(false);
                          } else {
                            const missing = [];
                            if (!title) {
                              missing.push('title');
                            }
                            if (title && title.length >= 20) {
                              missing.push('title less than 20 characters');
                            }
                            if (!dateRange[0] || !dateRange[1]) {
                              missing.push('date range');
                            }
                            if (!selectedLocation) {
                              missing.push('location');
                            }
                            // add and to ultimate item recursively
                            if (missing.length > 1) {
                              missing[missing.length - 1] = `and ${missing[missing.length - 1]}`;
                            }
                            setError(`Please provide a ${missing.join(', ')}.`);
                            // luckily none of these start with vowels lul

                            // set callback
                            setTimeout(() => {
                              setError(null);
                            }
                            , 5000);

                          }
                        }}
                      >
                        Submit for approval
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default Flyover;


const DATE_ARRAY = (
  props: { [key: string]: unknown },
  propName: string,
  componentName: string,
): Error | null => {
  const propValue = props[propName];

  if (
    !Array.isArray(propValue) ||
    propValue.length !== 2 ||
    !propValue.every(
      (date) => date instanceof Date || date === null
    )
  ) {
    return new Error(
      `Invalid prop ${propName}. Needs to be an array of two dates or null for component ${componentName}`
    );
  }
  return null;
};

DATE_ARRAY.isRequired = function(
  props: { [key: string]: unknown },
  propName: string,
  componentName: string,
): Error | null {
  if (props[propName] === undefined) {
    return new Error(
      `The prop ${propName} is marked as required in ${componentName}, but its value is 'undefined'`
    );
  }
  return DATE_ARRAY(props, propName, componentName);
};


Flyover.propTypes = {
  dateRange: DATE_ARRAY.isRequired,
  setDateRange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  createBooking: PropTypes.func.isRequired,
};