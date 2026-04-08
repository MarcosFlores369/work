import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchUser, fetchUserPosts, type User, type Post } from '../api/client'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const userId = Number(id)

  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const POSTS_PER_PAGE = 5
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const pagedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  useEffect(() => {
    Promise.all([fetchUser(userId), fetchUserPosts(userId)])
      .then(([u, p]) => {
        setUser(u)
        setPosts(p)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

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
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          &larr; Back to users
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        &larr; Back to users
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-gray-500 mb-4">@{user.username}</p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <dt className="text-gray-500">Email</dt>
          <dd className="text-gray-800">{user.email}</dd>
          <dt className="text-gray-500">Phone</dt>
          <dd className="text-gray-800">{user.phone}</dd>
          <dt className="text-gray-500">Website</dt>
          <dd className="text-gray-800">{user.website}</dd>
          <dt className="text-gray-500">Company</dt>
          <dd className="text-gray-800">{user.company.name}</dd>
          <dt className="text-gray-500">City</dt>
          <dd className="text-gray-800">{user.address.city}</dd>
        </dl>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts ({posts.length})</h2>
      <div className="space-y-3">
        {pagedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h3 className="font-medium text-gray-900 capitalize">{post.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.body}</p>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p: number) => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            &larr; Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p: number) => p + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
