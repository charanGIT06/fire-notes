import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Notes from './pages/Notes.jsx'
import Test from './pages/Test.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import Nav from './components/Nav.jsx'
import Archive from './pages/Archive.jsx'
import Trash from './pages/Trash.jsx'
import Profile from './pages/Profile.jsx'
import { NavProvider } from './context/NavContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Shared from './pages/Shared.jsx'
import {ColorModeScript} from '@chakra-ui/react'
import theme from '../src/js/theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ThemeProvider>
          <UserProvider>
            <NavProvider>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              <div className="app">
                <Nav />
                <Routes>
                  <Route path="/" element={<Notes />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/trash" element={<Trash />} />
                  <Route path="/shared" element={<Shared />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/test" element={<Test />} />
                </Routes>
              </div>
            </NavProvider>
          </UserProvider>
        </ThemeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
