import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchUsers, type User } from '../api/client'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Users</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No users match &ldquo;{search}&rdquo;.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((user) => (
          <Link
            key={user.id}
            to={`/users/${user.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mt-1">@{user.username}</p>
            <p className="text-sm text-gray-600 mt-2">{user.email}</p>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
