import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';


const TabHeaderListing = (): JSX.Element => {
  return (
  <div className="border-b border-neutral-300">
  <Tab.List className="-mb-px flex" aria-label="Tabs">
    <Tab as={Fragment}>
      {( { selected } ) => (
        <button
          className={classnames(
            selected ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-xs sm:text-sm'
          )}
          aria-current={selected ? 'page' : undefined}
        >
          General
        </button>
      )}
    </Tab>
    <Tab as={Fragment}>
      {( { selected } ) => (
        <button
          className={classnames(
            selected ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-xs sm:text-sm'
          )}
          aria-current={selected ? 'page' : undefined}
        >
          Approve Users
        </button>
      )}
    </Tab>
    <Tab as={Fragment}>
      {( { selected } ) => (
        <button
          className={classnames(
            selected ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-xs sm:text-sm'
          )}
          aria-current={selected ? 'page' : undefined}
        >
          Approve Bookings
        </button>
      )}
    </Tab>
  </Tab.List>
  </div>
  );
}


export default TabHeaderListing;
