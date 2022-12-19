// import type { Booking } from '../../types/calendar'
import Image from "next/image";
import { trpc } from "../../utils/trpc"

const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
]

export default function Bookings() {
  
  const users = trpc.users.getAllUsers.useQuery()
  
  if (users.isLoading) {
    return <div>Loading...</div>
  }

  if (users.error) {
    return <div>{users.error.message}</div>
  }

  const limboUsers = users.data.filter((user) => user.role === 'LIMBO')


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-neutral-900">Bookings</h1>
          <p className="mt-2 text-sm text-neutral-700">
            A list of all the bookings in the system, sorted by whether or not they have been approved.
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:w-auto"
          >
            Add user
          </button>
        </div> */}
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-neutral-300">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6">
                      &nbsp;
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                      Email
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {limboUsers.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 relative text-sm font-medium text-neutral-900 sm:pl-6">
                        { person.image ?
                        <Image src={person.image} alt={person.name + "profile"} fill={true} className="object-contain" />
                        : 
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        }
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{person.id}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{person.email}</td>
                      <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-sky-600 hover:text-sky-900 mr-6">
                          Approve<span className="sr-only">, {person.name}</span>
                        </button>
                        <button className="text-red-600 hover:text-sky-900">
                          Delete<span className="sr-only">, {person.name}</span>
                        </button>
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
  )
}