import classnames from "classnames";
import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import Link from "next/link";


type Tab = {
  name: string
  href: string
  current: boolean
}

type TabsProps = {
  tabs: Tab[]
}

export const Tabs: React.FC<TabsProps> = ({tabs}) => {

  const router = useRouter();

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
        className="block w-full rounded-md border-neutral-300 focus:border-sky-500 focus:ring-sky-500"
        defaultValue={tabs.find((tab) => tab.current)?.name}
        onChange={(e) => {
          const href = tabs.find((tab) => tab.name === e.target.value)?.href;
          if (href) {
            router.push(href);
          }
        }}
      >
        {tabs.map((tab) => (
          <option key={tab.name}>{tab.name}</option>
        ))}
      </select>
    </div>
    <div className="hidden sm:block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={classnames(
              tab.current ? 'bg-sky-100 text-sky-700' : 'text-neutral-500 hover:text-neutral-700',
              'px-3 py-2 font-medium text-sm rounded-md'
            )}
            aria-current={tab.current ? 'page' : undefined}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  </div>
  )
}

export default Tabs;