// import type { Booking } from '../../types/calendar'
import Image from "next/image";
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import type { RouterOutputs } from "../../utils/trpc";

const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
]

type User = RouterOutputs["users"]["getAllUsers"][0]

export default function Bookings() {

  const { data: session } = useSession()
  
  const users = trpc.users.getAllUsers.useQuery()

  const [limboUsers, setLimboUsers] = useState<User[]>([])
  const [allowedUsers, setAllowedUsers] = useState<User[]>([])

  useEffect(() => {
    if (users.data) {
      setLimboUsers(users.data.filter((user) => user.role === 'LIMBO'))
      setAllowedUsers(users.data.filter((user) => user.role === 'USER' || user.role === 'ADMIN'))
    }
  }, [users.data])
  
  if (users.isLoading) {
    return <div>Loading...</div>
  }

  if (users.error) {
    return (
      <div className="text-red-500">
        {users.error.message}
      </div>
    );
  }

  // const limboUsers = users.data.filter((user) => user.role === 'LIMBO')
  // const allowedUsers = users.data.filter((user) => user.role === 'USER' || user.role === 'ADMIN')

  const approveUser = (id: string) => {
    const query = trpc.users.allowAccess.useQuery(id)
    if (query.error) {
      console.log(query.error)
    }
    // optimistically update the UI
    const user = users.data.find((user) => user.id === id)
    if (user) {
      user.role = "USER"
    }
    
  }


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-neutral-900">Users</h1>
          <p className="mt-2 text-sm text-neutral-700">
            Here you can manage all users, including whether or not they have access to the calendar.
          </p>
        </div>
      </div>


      <h1 className="text-xl font-semibold text-neutral-900 mt-8">Pending Users</h1>
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
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                      ID
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
                        <div className="relative w-10 h-10 rounded-full"><Image src={person.image} alt={person.name + "profile"} fill={true} className="object-contain" /></div>
                        : 
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <span className="text-neutral-500">{person.name ? person.name[0] : ""}</span>
                        </div>
                        }
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{person.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{person.id}</td>
                      <td className="relative whitespace-nowrap py-4 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-sky-600 hover:text-sky-900 mr-6"
                          onClick={() => approveUser(person.id)}
                        >
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
  

      <h1 className="text-xl font-semibold text-neutral-900 mt-8">Allowed Users</h1>
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
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                      ID
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {allowedUsers.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 relative text-sm font-medium text-neutral-900 sm:pl-6">
                        { person.image ?
                        <div className="relative w-10 h-10 rounded-full"><Image src={person.image} alt={person.name + "profile"} fill={true} className="object-cover rounded-full" /></div>
                        : 
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <span className="text-neutral-500">{person.name ? person.name[0] : ""}</span>
                        </div>
                        }
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{person.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{person.id}</td>
                      <td className="relative whitespace-nowrap py-4 pl-2 pr-4 text-right text-sm font-medium sm:pr-6">
                        {person.id !== session?.user.id && <button className="text-red-600 hover:text-sky-900">
                          Delete<span className="sr-only">, {person.name}</span>
                        </button>}
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