import { Fragment, useState, useEffect } from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  // ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { format, parseISO, isSameMonth, isSameDay, isToday } from 'date-fns'
import classnames from 'classnames'

// import * as z from 'zod';
// const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
// type DateString = z.infer<typeof dateSchema>;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const days = [
//   { date: '2021-12-27', events: [] },
//   { date: '2021-12-28', events: [] },
//   { date: '2021-12-29', events: [] },
//   { date: '2021-12-30', events: [] },
//   { date: '2021-12-31', events: [] },
//   { date: '2022-01-01', isCurrentMonth: true, events: [] },
//   { date: '2022-01-02', isCurrentMonth: true, events: [] },
//   {
//     date: '2022-01-03',
//     isCurrentMonth: true,
//     events: [
//       { id: 1, name: 'Design review', time: '10AM', datetime: '2022-01-03T10:00', href: '#' },
//       { id: 2, name: 'Sales meeting', time: '2PM', datetime: '2022-01-03T14:00', href: '#' },
//     ],
//   },
//   { date: '2022-01-04', isCurrentMonth: true, events: [] },
//   { date: '2022-01-05', isCurrentMonth: true, events: [] },
//   { date: '2022-01-06', isCurrentMonth: true, events: [] },
//   {
//     date: '2022-01-07',
//     isCurrentMonth: true,
//     events: [{ id: 3, name: 'Date night', time: '6PM', datetime: '2022-01-08T18:00', href: '#' }],
//   },
//   { date: '2022-01-08', isCurrentMonth: true, events: [] },
//   { date: '2022-01-09', isCurrentMonth: true, events: [] },
//   { date: '2022-01-10', isCurrentMonth: true, events: [] },
//   { date: '2022-01-11', isCurrentMonth: true, events: [] },
//   {
//     date: '2022-01-12',
//     isCurrentMonth: true,
//     isToday: true,
//     events: [{ id: 6, name: "Sam's birthday party", time: '2PM', datetime: '2022-01-25T14:00', href: '#' }],
//   },
//   { date: '2022-01-13', isCurrentMonth: true, events: [] },
//   { date: '2022-01-14', isCurrentMonth: true, events: [] },
//   { date: '2022-01-15', isCurrentMonth: true, events: [] },
//   { date: '2022-01-16', isCurrentMonth: true, events: [] },
//   { date: '2022-01-17', isCurrentMonth: true, events: [] },
//   { date: '2022-01-18', isCurrentMonth: true, events: [] },
//   { date: '2022-01-19', isCurrentMonth: true, events: [] },
//   { date: '2022-01-20', isCurrentMonth: true, events: [] },
//   { date: '2022-01-21', isCurrentMonth: true, events: [] },
//   {
//     date: '2022-01-22',
//     isCurrentMonth: true,
//     isSelected: true,
//     events: [
//       { id: 4, name: 'Maple syrup museum', time: '3PM', datetime: '2022-01-22T15:00', href: '#' },
//       { id: 5, name: 'Hockey game', time: '7PM', datetime: '2022-01-22T19:00', href: '#' },
//     ],
//   },
//   { date: '2022-01-23', isCurrentMonth: true, events: [] },
//   { date: '2022-01-24', isCurrentMonth: true, events: [] },
//   { date: '2022-01-25', isCurrentMonth: true, events: [] },
//   { date: '2022-01-26', isCurrentMonth: true, events: [] },
//   { date: '2022-01-27', isCurrentMonth: true, events: [] },
//   { date: '2022-01-28', isCurrentMonth: true, events: [] },
//   { date: '2022-01-29', isCurrentMonth: true, events: [] },
//   { date: '2022-01-30', isCurrentMonth: true, events: [] },
//   { date: '2022-01-31', isCurrentMonth: true, events: [] },
//   { date: '2022-02-01', events: [] },
//   { date: '2022-02-02', events: [] },
//   {
//     date: '2022-02-03',
//     events: [{ id: 7, name: 'Cinema with friends', time: '9PM', datetime: '2022-02-04T21:00', href: '#' }],
//   },
//   { date: '2022-02-04', events: [] },
//   { date: '2022-02-05', events: [] },
//   { date: '2022-02-06', events: [] },
// ]


// const selectedDay = days.find((day) => day.isSelected)
interface Day {
  // date: DateString; // in the format of YYYY-MM-DD so keys are unique
  date: Date;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
}
// type DateString = string & {
//   split(separator: string): string[];
//   pop(): string;
//   replace(pattern: RegExp, replacement: string): string;
// } // in the format of YYYY-MM-DD so keys are unique

type SelectedRange = [Date, Date] | null

export default function Calendar() {

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<SelectedRange>(null)

  const today = new Date();
  const checkIfToday = (day: Day) => day.date === today;

  const [days, setDays] = useState<Day[]>([]);

  // populate the array of calendar days with a dependency on the current month and year
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // create an array of days from 1 to the last day in the month
    const _days: Day[] = Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNumber) => {
      const date = new Date(selectedYear, selectedMonth, dayNumber);
      const isCurrentMonth = date.getMonth() === selectedMonth;
      const isToday = date.toDateString() === new Date().toDateString();
      return {
        date,
        isCurrentMonth,
        isToday,
        // isSelected,
      };
    });

    // add empty placeholders for the first few days so that the 1st always falls on the correct day of the week
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const numberOfPlaceholders = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < numberOfPlaceholders; i++) {
      _days.unshift({
        date: new Date(selectedYear, selectedMonth, -i),
      });
    }

    // add empty placeholders for the last few days so that the last day always falls on a Saturday
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0).getDay();
    const numberOfPlaceholdersAtEnd = lastDayOfMonth === 7 ? 0 : 7 - lastDayOfMonth;
    for (let i = 0; i < numberOfPlaceholdersAtEnd; i++) {
      _days.push({
        date: new Date(selectedYear, selectedMonth + 1, i + 1),
      });
    }

    setDays(_days);
  }, [selectedMonth, selectedYear]);

  // 
// To allow users to drag with the mouse to select dates in your calendar component, you can use the onMouseDown, onMouseMove, and onMouseUp event handlers. Here is a rough outline of how you might implement this behavior:

// In your calendar component, add state to store the currently selected date range. This state should be initialized with an empty array.
// When the user clicks on a date with the mouse, set the start date for the selected range to the clicked date. This should also update the state to store the start date.
// When the user moves the mouse over other dates, update the selected range in the state by adding all of the dates between the start date and the current date to the range.
// When the user releases the mouse, set the end date for the selected range and update the state to store the end date.

  

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 py-4 px-6 lg:flex-none">
      <h1 className="text-lg font-semibold text-gray-900">
  <time dateTime={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}>
    {monthNames[selectedMonth - 1]} {selectedYear}
  </time>
</h1>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
              onClick={() => {
                const today = new Date();
                setSelectedMonth(today.getMonth() + 1);
                setSelectedYear(today.getFullYear());
              }}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Month view
                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classnames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classnames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classnames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classnames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Year view
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      {/* DESKTOP CALENDER */}
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
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
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date.toDateString()}
                className={classnames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative py-2 px-3 min-h-[100px]'
                )}
                
              >
                <time
                  dateTime={day.date.toDateString()}
                  className={
                    checkIfToday(day)
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
                      : undefined
                  }
                >
                  {day.date.getDate()}
                </time>
                {/* {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && <li className="text-gray-500">+ {day.events.length - 2} more</li>}
                  </ol>
                )} */}
              </div>
            ))}
          </div>

          {/* MOBILE CALENDER */}
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) =>  { 
              const isToday = checkIfToday(day);
            return (
              <button
                key={day.date.toDateString()}
                type="button"
                className={classnames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  (day.isSelected || isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected && isToday && 'text-indigo-600',
                  !day.isSelected && day.isCurrentMonth && !isToday && 'text-gray-900',
                  !day.isSelected && !day.isCurrentMonth && !isToday && 'text-gray-500',
                  'flex h-14 flex-col py-2 px-3 hover:bg-gray-100 focus:z-10 min-h-[70px]'
                )}
              >
                <time
                  dateTime={day.date.toDateString()}
                  className={classnames(
                    day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full',
                    day.isSelected && isToday && 'bg-indigo-600',
                    day.isSelected && !isToday && 'bg-gray-900',
                    'ml-auto'
                  )}
                >
                  {day.date.getDate()}
                </time>
                <span className="sr-only">{day.date.getDate()} events</span>
                {true && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    
                  </span>
                )}
              </button>
            )})}
          </div>
        </div>
      </div>
      {/* <Events selectedDay={selectedDay} /> */}
    </div>
  )
}

// const Events = ({ selectedDay }: { selectedDay: SelectedDay | undefined }) => {
//   const events = []

//   if (selectedDay?.events.length > 0) {
//     return (
//       <div className="py-10 px-4 sm:px-6 lg:hidden">
//         <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
//           {selectedDay.events.map((event: Event) => (
//             <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
//               <div className="flex-auto">
//                 <p className="font-semibold text-gray-900">{event.name}</p>
//                 <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
//                   <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
//                   {event.time}
//                 </time>
//               </div>
//               <a
//                 href={event.href}
//                 className="ml-6 flex-none self-center rounded-md border border-gray-300 bg-white py-2 px-3 font-semibold text-gray-700 opacity-0 shadow-sm hover:bg-gray-50 focus:opacity-100 group-hover:opacity-100"
//               >
//                 Edit<span className="sr-only">, {event.name}</span>
//               </a>
//             </li>
//           ))}
//         </ol>
//       </div>
//     );
//   } else {
//     return null;
//   }
// };