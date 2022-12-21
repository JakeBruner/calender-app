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
            'w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm'
          )}
          aria-current={selected ? 'page' : undefined}
        >
          General
        </button>
      )}
    </Tab>
    {/* <Tab as={Fragment}>
      {( { selected } ) => (
        <button

          className={classnames(
            selected ? 'border-sky-500 text-sky-600' : 'text-neutral-500 hover:text-neutral-700',

            // tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
            'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-neutral-50 focus:z-10'
          )}
        >
          Approve Users
          <span
            aria-hidden="true"
            className={classnames(
              selected ? 'bg-sky-500' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5'
            )} />
        </button>
      )}
    </Tab>
    <Tab as={Fragment}>
      {( { selected } ) => (
        <button
          className={classnames(
            selected ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700',
            'rounded-r-lg',
            'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-neutral-50 focus:z-10'
          )}
        >
          Approve Bookings
          <span
            aria-hidden="true"
            className={classnames(
              selected ? 'bg-sky-500' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5'
            )} />
        </button>
      )}
    </Tab> */}
  </Tab.List>
  </div>
  );
}


export default TabHeaderListing;

export function Example() {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-sky-500 focus:ring-sky-500"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}