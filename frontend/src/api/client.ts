const BASE = '/api'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string }
  address: { street: string; city: string }
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export const fetchUsers = () => apiFetch<User[]>('/users')
export const fetchUser = (id: number) => apiFetch<User>(`/users/${id}`)
export const fetchUserPosts = (id: number) => apiFetch<Post[]>(`/users/${id}/posts`)
export const fetchPost = (id: number) => apiFetch<Post>(`/posts/${id}`)
export const fetchPostComments = (id: number) => apiFetch<Comment[]>(`/posts/${id}/comments`)
