import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPost, fetchPostComments, type Post, type Comment } from '../api/client'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchPost(postId), fetchPostComments(postId)])
      .then(([p, c]) => {
        setPost(p)
        setComments(c)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [postId])

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
          &larr; Back
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        to={`/users/${post.userId}`}
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to user
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 capitalize mb-3">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed">{post.body}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-gray-900 capitalize text-sm">{comment.name}</p>
              <p className="text-xs text-gray-400">{comment.email}</p>
            </div>
            <p className="text-sm text-gray-600">{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
