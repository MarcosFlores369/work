import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserList from './pages/UserList'
import UserDetail from './pages/UserDetail'
import PostDetail from './pages/PostDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
