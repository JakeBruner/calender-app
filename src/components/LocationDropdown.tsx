
import { Listbox, Transition } from "@headlessui/react";
import { type FC, Fragment } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

import { locationsList } from "../types/location";

import classnames from "classnames"

type LocationFull = typeof locationsList[number];
// type LocationName = keyof typeof locations;

type LocationSelectProps = {
  selectedLocation: LocationFull | null;
  setSelectedLocation: (location: LocationFull) => void;
};

const LocationDropdown: FC<LocationSelectProps> = ({
  selectedLocation,
  setSelectedLocation,
}) => {

  return (
    <div className="z-40">
      <Listbox value={selectedLocation} onChange={setSelectedLocation}>
        {({ open }) => (
          <>
            <div className="relative mt-1 z-10">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm">
                <span className="block truncate">
                  {selectedLocation
                    ? selectedLocation.name
                    : "Select a location"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-neutral-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {locationsList.map((l) => (
                    <Listbox.Option
                      key={l.id}
                      className={({ active }) =>
                        classnames(
                          active ? "bg-sky-600 text-white" : "text-neutral-900",
                          "relative cursor-default select-none py-2 pl-8 pr-4"
                        )
                      }
                      value={l}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classnames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {l.name}
                          </span>

                          {selected ? (
                            <span
                              className={classnames(
                                active ? "text-white" : "text-sky-600",
                                "absolute inset-y-0 left-0 flex items-center pl-1.5"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default LocationDropdown;