import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Notes from "./pages/Notes/Notes.jsx";
import Tasks from "./pages/Tasks/Tasks.jsx";
// import Test from './pages/Test.jsx'
import { ChakraProvider } from "@chakra-ui/react";
import Nav from "./components/Navigation/Nav.jsx";
import Archive from "./pages/Archive.jsx";
import Trash from "./pages/Trash.jsx";
import Profile from "./pages/Profile.jsx";
import { NavProvider } from "./context/NavContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { NotesProvider } from "./context/NotesContext.jsx";
import Login from "./pages/Authentication/Login.jsx";
import Signup from "./pages/Authentication/Signup.jsx";
import Shared from "./pages/Shared.jsx";
import PresentNote from "./pages/Notes/PresentNote.jsx";
import ProtectedRoute from "./components/Authentication/ProtectedRoute.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import PresentTask from "./pages/Tasks/PresentTask.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <ThemeProvider>
          <UserProvider>
            <NavProvider>
              <NotesProvider>
                <TasksProvider>
                  <div className='app'>
                    <Nav />
                    <Routes>
                      <Route path='/' element={<Notes />} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/signup' element={<Signup />} />
                      <Route path='/archive' element={<Archive />} />
                      <Route path='/trash' element={<Trash />} />
                      <Route path='/shared' element={<Shared />} />
                      <Route path='/pnote/:page' element={<PresentNote />} />
                      <Route path='/ptask/:page' element={<PresentTask />} />
                      <Route path='/tasks' element={<Tasks />} />
                      <Route
                        path='/profile'
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      {/* <Route path="/test" element={<Test />} /> */}
                    </Routes>
                  </div>
                </TasksProvider>
              </NotesProvider>
            </NavProvider>
          </UserProvider>
        </ThemeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
