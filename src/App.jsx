import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Notes from './pages/Notes.jsx'
// import Test from './pages/Test.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import Nav from './components/Nav.jsx'
import Archive from './pages/Archive.jsx'
import Trash from './pages/Trash.jsx'
import Profile from './pages/Profile.jsx'
import { NavProvider } from './context/NavContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotesProvider } from './context/NotesContext.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Shared from './pages/Shared.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ThemeProvider>
          <UserProvider>
            <NavProvider>
              <NotesProvider>
                <div className="app">
                  <Nav />
                  <Routes>
                    <Route path="/" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
                    <Route path="/trash" element={<ProtectedRoute><Trash /></ProtectedRoute>} />
                    <Route path="/shared" element={<ProtectedRoute><Shared /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    {/* <Route path="/test" element={<Test />} /> */}
                  </Routes>
                </div>
              </NotesProvider>
            </NavProvider>
          </UserProvider>
        </ThemeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
