import { Fragment, useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  // ClockIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
// import { isToday } from 'date-fns'
import classnames from "classnames";

// import * as z from 'zod';
// const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
// type DateString = z.infer<typeof dateSchema>;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

type SelectedRange = [Date | null, Date | null];

const isToday = (date: Date): boolean =>
  date.getMonth() === new Date().getMonth() &&
  date.getDate() === new Date().getDate();

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedRange, setSelectedRange] = useState<SelectedRange>([
    null,
    null,
  ]);
  // const [ isDragging, setIsDragging ] = useState( false );

  // if there needs to be 5 or 6 rows of days
  const [moreRows, setMoreRows] = useState(false);

  const [days, setDays] = useState<Day[]>([]);

  // populate the array of calendar days with a dependency on the current month and year
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // create an array of days from 1 to the last day in the month
    const _days: Day[] = Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    ).map((dayNumber) => {
      const date = new Date(selectedYear, selectedMonth, dayNumber);
      const isCurrentMonth = date.getMonth() === selectedMonth;
      // const isToday = date.toDateString() === new Date().toDateString();
      return {
        date,
        isCurrentMonth,
        // isToday,
        // isSelected,
      };
    });

    // add empty placeholders for the first few days so that the 1st always falls on the correct day of the week
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const numberOfPlaceholders =
      firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    for (let i = 0; i < numberOfPlaceholders; i++) {
      _days.unshift({
        date: new Date(selectedYear, selectedMonth, -i),
      });
    }

    // add empty placeholders for the last few days so that the last day always falls on a Saturday
    const lastDayOfMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDay();
    const numberOfPlaceholdersAtEnd =
      lastDayOfMonth === 7 ? 0 : 7 - lastDayOfMonth;
    for (let i = 0; i < numberOfPlaceholdersAtEnd; i++) {
      _days.push({
        date: new Date(selectedYear, selectedMonth + 1, i + 1),
      });
    }

    // check if needs more rows
    if (_days.length > 35) {
      setMoreRows(true);
    } else {
      setMoreRows(false);
    }

    setDays(_days);
  }, [selectedMonth, selectedYear]);

  // helper functions for interacting with the calendar
  const idToDate = (id: number) => new Date(selectedYear, selectedMonth, id);

  const isInRange = (date: Date) => {
    // if only one date is selected, return true if the date is the same as the selected date
    if (!selectedRange[0] && !selectedRange[1]) return false;
    if (!selectedRange[1])
      return date.toDateString() === selectedRange[0]?.toDateString();
    if (!selectedRange[0])
      return false
    return date >= selectedRange[0] && date <= selectedRange[1];
  };

  useEffect(() => {
    // When the selectedRange state variable changes, update the component
    console.log("selectedRange", selectedRange);
    // setSelectedRange(selectedRange);
  }, [selectedRange]);

  // const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // // Define a useEffect hook to listen for changes to the user's cursor position
  // useEffect(() => {
  //   // When the user's cursor position changes, update the selectedRange state variable
  //   setSelectedRange([cursorRef.current.x, cursorRef.current.y]);
  // }, [cursorRef.current.x, cursorRef.current.y]);
  // const handleMouseMove = (event: React.MouseEvent, date: Date) => {
  //   // Update the user's cursor position in the cursorRef object
  //   cursorRef.current = { x: event.pageX, y: event.pageY };

  //   // Pass the date of the div element that the user's cursor is hovering over to the setSelectedRange function
  //   setSelectedRange(date);
  // };

  const handleClick = (event: React.MouseEvent) => {
    console.log(event.target);
    if (event.target instanceof HTMLDivElement) {
      // Get the selected day's id value
      if (!event.target.id) return;
      if (!selectedRange[0]) {
        const selectedDayId = parseInt(event.target.id, 10);
        // console.log(selectedDayId)
        // Use the mapping function to convert the selected day's id into a Date object
        const selectedDate = idToDate(selectedDayId);
        // Update the selected day state variable with the Date object
        setSelectedRange([selectedDate, null]);
      }
      if (selectedRange[0] && !selectedRange[1]) {
        const selectedDayId = parseInt(event.target.id, 10);
        console.log(selectedDayId);

        // Use the mapping function to convert the selected day's id into a Date object
        const selectedDate = idToDate(selectedDayId);

        // Update the selected day state variable with the Date object
        setSelectedRange([selectedRange[0], selectedDate]);
      }
      if (selectedRange[0] && selectedRange[1]) {
        setSelectedRange([null, null]);
      }
    }
  };

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 py-4 px-6 lg:flex-none">
        <h1 className="text-lg font-semibold text-neutral-900">
          <time
            dateTime={`${selectedYear}-${selectedMonth
              .toString()
              .padStart(2, "0")}`}
          >
            {monthNames[selectedMonth]} {selectedYear}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-neutral-300 bg-white py-2 pl-3 pr-4 text-neutral-400 hover:text-neutral-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-50"
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
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
              className="hidden border-t border-b border-neutral-300 bg-white px-3.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus:relative md:block"
              onClick={() => {
                const today = new Date();
                setSelectedMonth(today.getMonth());
                setSelectedYear(today.getFullYear());
              }}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-neutral-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-neutral-300 bg-white py-2 pl-4 pr-3 text-neutral-400 hover:text-neutral-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-50"
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
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
                className="flex items-center rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
              >
                Month view
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-neutral-400"
                  aria-hidden="true"
                />
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
                            active
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-700",
                            "block px-4 py-2 text-sm"
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
                            active
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-700",
                            "block px-4 py-2 text-sm"
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
                            active
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-700",
                            "block px-4 py-2 text-sm"
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
                            active
                              ? "bg-neutral-100 text-neutral-900"
                              : "text-neutral-700",
                            "block px-4 py-2 text-sm"
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
            <div className="ml-6 h-6 w-px bg-neutral-300" />
            <button
              type="button"
              className="ml-6 rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-neutral-400 hover:text-neutral-500">
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
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-neutral-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classnames(
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
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
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
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
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
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
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
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
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
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
                          active
                            ? "bg-neutral-100 text-neutral-900"
                            : "text-neutral-700",
                          "block px-4 py-2 text-sm"
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
        <div className="grid grid-cols-7 gap-px border-b border-neutral-300 bg-neutral-200 text-center text-xs font-semibold leading-6 text-neutral-700 lg:flex-none">
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
        <div className="flex bg-neutral-200 text-xs leading-6 text-neutral-700 lg:flex-auto">
          <div
            className={classnames(
              moreRows ? "lg:grid-rows-6" : "lg:grid-rows-5",
              "hidden w-full lg:grid lg:grid-cols-7 lg:gap-px"
            )}
            onClick={handleClick}
          >
            {days.map((day) => {
              const isItToday = isToday(day.date);
              const isSelected = isInRange(day.date);
              return (
                <div
                  key={day.date.toDateString()}
                  id={day.date.getDate().toString()}
                  className={classnames(
                    day.isCurrentMonth
                      ? "bg-white" : "bg-neutral-100",
                      (isSelected || isItToday) && "font-semibold",
                      isSelected && "text-white",
                      !isSelected && isItToday && "text-sky-600",
                      !isSelected &&
                        day.isCurrentMonth &&
                        !isItToday &&
                        "text-neutral-900",
                      !isSelected &&
                        !day.isCurrentMonth &&
                        !isItToday &&
                        "text-neutral-500",
                    "relative min-h-[100px] py-2 px-3 hover:bg-neutral-100"
                  )}
                >
                  <time
                    dateTime={day.date.toDateString()}
                    className={classnames(
                      isSelected &&
                        "flex h-6 w-6 items-center justify-center rounded-full",
                      isSelected && isItToday && "bg-sky-600",
                      isSelected && !isItToday && "bg-neutral-900",
                      isItToday && !isSelected
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 font-semibold text-white"
                        : undefined
                    )}
                  >
                    {day.date.getDate()}
                  </time>
                  {/* {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p className="flex-auto truncate font-medium text-neutral-900 group-hover:text-sky-600">
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-neutral-500 group-hover:text-sky-600 xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && <li className="text-neutral-500">+ {day.events.length - 2} more</li>}
                  </ol>
                )} */}
                </div>
              );
            })}
          </div>

          {/* MOBILE CALENDER */}
          <div
            className={classnames(
              moreRows ? "grid-rows-6" : "grid-rows-5",
              "isolate grid w-full grid-cols-7 gap-px lg:hidden"
            )}
            onClick={handleClick}
          >
            {days.map((day) => {
              const isItToday = isToday(day.date);
              const isSelected = isInRange(day.date);
              // console.log(isSelected)
              return (
                <div
                  key={day.date.toDateString()}
                  id={day.date.getDate().toString()}
                  className={classnames(
                    day.isCurrentMonth ? "bg-white" : "bg-neutral-100",
                    (isSelected || isItToday) && "font-semibold",
                    isSelected && "text-white",
                    !isSelected && isItToday && "text-sky-600",
                    !isSelected &&
                      day.isCurrentMonth &&
                      !isItToday &&
                      "text-neutral-900",
                    !isSelected &&
                      !day.isCurrentMonth &&
                      !isItToday &&
                      "text-neutral-500",
                    "flex h-14 min-h-[70px] flex-col py-2 px-3 hover:bg-neutral-100 focus:z-10"
                  )}
                >
                  <time
                    dateTime={day.date.toDateString()}
                    className={classnames(
                      isSelected &&
                        "flex h-6 w-6 items-center justify-center rounded-full",
                      isSelected && isItToday && "bg-sky-600",
                      isSelected && !isItToday && "bg-neutral-900",
                      "ml-auto"
                    )}
                  >
                    {day.date.getDate()}
                  </time>
                  <span className="sr-only">{day.date.getDate()} events</span>
                  {/* {true && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    
                  </span>
                )} */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <Events selectedDay={selectedDay} /> */}
    </div>
  );
}

// const Events = ({ selectedDay }: { selectedDay: SelectedDay | undefined }) => {
//   const events = []

//   if (selectedDay?.events.length > 0) {
//     return (
//       <div className="py-10 px-4 sm:px-6 lg:hidden">
//         <ol className="divide-y divide-neutral-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
//           {selectedDay.events.map((event: Event) => (
//             <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-neutral-50 hover:bg-neutral-50">
//               <div className="flex-auto">
//                 <p className="font-semibold text-neutral-900">{event.name}</p>
//                 <time dateTime={event.datetime} className="mt-2 flex items-center text-neutral-700">
//                   <ClockIcon className="mr-2 h-5 w-5 text-neutral-400" aria-hidden="true" />
//                   {event.time}
//                 </time>
//               </div>
//               <a
//                 href={event.href}
//                 className="ml-6 flex-none self-center rounded-md border border-neutral-300 bg-white py-2 px-3 font-semibold text-neutral-700 opacity-0 shadow-sm hover:bg-neutral-50 focus:opacity-100 group-hover:opacity-100"
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
