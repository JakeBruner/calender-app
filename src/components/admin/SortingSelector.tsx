import { type FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import classnames from 'classnames';
import { type sortingNumbers, sortingOptions, sortingOptionsArray } from './Bookings';


type SortingSelectorProps = { // this isnt confusing at all...
  sorting: sortingNumbers;
  setSorting: (sorting: sortingNumbers) => void;
};

export const SortingSelector: FC<SortingSelectorProps> = ({ sorting, setSorting }) => {

  return (
    <Listbox value={sorting} onChange={setSorting}>
      {({ open }) => (
        <>
          <div className="relative md:flex md:flex-row">
            <Listbox.Label className="block self-center pr-3 text-xs sm:text-sm font-medium text-neutral-700">Sorting by</Listbox.Label>
            <div className="relative">
            <Listbox.Button className="relative min-w-20 sm:min-w-44 max-w-36 sm:max-w-max w-full  cursor-default rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
              <span className="block truncate text-xs sm:text-base">{sortingOptions[sorting]}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 min-w-20 sm:min-w-44 max-w-36 sm:max-w-max w-full overflow-auto rounded-md !bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {sortingOptionsArray.map((option) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) =>
                      classnames(
                        active ? 'text-white bg-sky-600' : 'text-neutral-900',
                        'relative bg-white cursor-default select-none py-2 pl-3 pr-7'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classnames(
                        selected ? 'font-semibold' : 'font-normal', 
                        'block truncate text-xs sm:text-base'
                        )}>
                          {sortingOptions[option]}
                        </span>

                        {selected ? (
                          <span
                            className={classnames(
                              active ? 'text-white' : 'text-sky-600',
                              'absolute inset-y-0 right-0 flex items-center pr-3'
                            )}
                          >
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
            </div>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default SortingSelector;