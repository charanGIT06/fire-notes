import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, InputGroup, Input, InputRightAddon, useDisclosure, InputLeftElement, Avatar, InputRightElement } from "@chakra-ui/react" //eslint-disable-line no-unused-vars
import { GiHamburgerMenu } from "react-icons/gi"
import { Link, useNavigate } from "react-router-dom"
import NavState from "../context/NavContext";
import UserState from "../context/UserContext";
import { SearchIcon } from "@chakra-ui/icons"
import ThemeState from "../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import '../scss/index.scss'

const Nav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setSearchText } = NavState()
  const { theme, toggleTheme } = ThemeState()
  const { user } = UserState()
  const navigate = useNavigate()
  const location = useLocation()
  const page = location.pathname.split('/')
  let pageName = '/' + page[page.length - 1]
  if (pageName === '/notes') {
    pageName = '/'
  } 
  const [themeColor, setThemeColor] = useState(theme === 'dark' ? 'gray' : 'black')

  useEffect(() => {
    setThemeColor(theme === 'dark' ? 'gray' : 'lightGray')
  }, [theme])

  return (
    <>
      <div className={`nav ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
        <div className="big-screens d-none d-md-block w-100 p-2">
          <div className="d-flex flex-row align-items-center w-100 py-3 px-3">
            <Link to={'/'} className="w-25">🔥Fire Notes</Link>
            <div className="searchbar w-50 d-flex flex-row align-items-center p-2" style={{ border: `2px solid ${themeColor}`, borderRadius: '25px' }}>
              <SearchIcon color='grey' className="mx-2" />
              <Input type="text" variant='unstyled' placeholder="Search" onChange={(e) => {
                setSearchText(e.target.value)
              }} />
            </div>
            <div className="w-25 d-flex flex-row justify-content-end align-items-center">
              <div className="account d-flex flex-row align-items-center p-2" style={{ borderRadius: '50px', cursor: 'pointer' }} onClick={() => {
                if (user && user.uid !== undefined) {
                  navigate('/profile')
                } else {
                  navigate('/login')
                }
              }}>
                <p className="my-0 me-2">{user && user.displayName || 'Login'}</p>
                <Avatar name={user && user.displayName} size='sm' />
              </div>
            </div>
          </div>
        </div>
        <div className="mobile d-block d-md-none px-3 pt-3 w-100">
          <div className="search-bar d-flex flex-row align-items-center w-100 p-2" style={{ border: `2px solid ${themeColor}`, borderRadius: '25px' }}>
            <GiHamburgerMenu className='nav-icon ms-2' size='1.5rem' color="grey" onClick={() => { onOpen() }} />
            <Input type="text" variant='unstyled' className="mx-3" placeholder="Search" onChange={(e) => {
              setSearchText(e.target.value)
            }} />
            < Avatar name={user && user.displayName
            } size='sm' onClick={
              () => {
                if (user) {
                  navigate('/profile')
                } else {
                  navigate('/login')
                }
              }
            } />
          </div>
        </div>
      </div>
      {/* <div className={`${isMobile ? 'd-none' : 'd-block'} nav d-flex flex-row align-items-center justify-content-center shadow-sm p-3 w-100 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
        <Link to={user !== {} ? '/' : '/login'} className="branding p-0 m-0 w-25">
          <h6 className="p-0 m-0">🔥Fire Notes</h6>
        </Link>
        <div className="searchbar w-50">
          <InputGroup>
            <InputLeftElement>
              <GiHamburgerMenu className='nav-icon d-block d-md-none' onClick={() => { onOpen() }} />
              <SearchIcon color='grey' className="d-none d-md-block" />
            </InputLeftElement>
            <Input className={theme === 'dark' ? "bg-dark" : ''} border={theme === 'dark' ? '1px' : '0px'} variant='filled' colorScheme="grey" placeholder='Search' focusBorderColor="yellow.400" onChange={(e) => { setSearchText(e.target.value) }} />
            <InputRightElement>
              <SearchIcon className="d-block d-md-none bg-dark" />
            </InputRightElement>
          </InputGroup>
        </div>
        <div className="profile w-25 d-flex flex-row justify-content-end align-items-center" style={{ cursor: 'pointer' }} onClick={() => {
          if (user) {
            navigate('/profile')
          } else {
            navigate('/login')
          }
        }} >
          <p className="my-0 me-2 d-none d-md-block">{user && user.displayName}</p>
          <Avatar name={user && user.displayName} size='sm' />
        </div>
      </div >
      <div className={`nav d-flex flex-column justify-content-center align-items-center ${isMobile ? 'd-block' : 'd-none'} ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
        <div className={`search-container px-2 ${isMobile ? 'd-block' : 'd-none'}`}>
          <div className="search-bar d-flex flex-row align-items-center w-100 p-2" style={{ border: `1px solid white`, borderRadius: '25px' }}>
            <GiHamburgerMenu className='nav-icon ms-2' size='1.35rem' onClick={() => { onOpen() }} />
            <Input type="text" variant='unstyled' className="mx-3" placeholder="Search" />
            <Avatar name={user && user.displayName} size='sm' onClick={
              () => {
                if (user) {
                  navigate('/profile')
                } else {
                  navigate('/login')
                }
              }
            } />
          </div>
        </div>
      </div> */}
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} className='bg-dark' >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px' className={theme === 'dark' ? "bg-dark text-white" : 'bg-white text-dark'} >
            <h4>🔥Fire Notes</h4>
          </DrawerHeader>
          <DrawerBody className={theme === 'dark' ? "bg-dark text-white m-0 p-0" : 'bg-white text-dark m-0 p-0'}>
            <div className="links">
              <ul className="list-unstyled">
                {[['/', 'Notes'], ['/shared', 'Shared'], ['/archive', 'Archive'], ['/trash', 'Trash'], ['/profile', 'Profile']].map(([route, text]) => {
                  return (
                    <Link to={route} key={text}
                      onClick={() => { onClose() }}
                    >
                      <p className={`link px-3 py-3 m-0 ${pageName === route ? 'link-active text-dark' : ''}`}>{text}</p>
                    </Link>
                  )
                })}
              </ul>
              <div className="theme px-3 d-flex flex-row align-items-center justify-content-start" style={{ cursor: 'pointer' }}
                onClick={() => { toggleTheme() }}>
                {
                  theme === 'dark' ?
                    <div className="light d-flex flex-row align-items-center">
                      <p className='m-0 p-0'>Light</p>
                      <MdLightMode className='mx-2' />
                      <sup style={{ color: '#feae3b' }}>BETA</sup>
                    </div> :
                    <div className="dark d-flex flex-row align-items-center">
                      <p className='m-0 p-0'>Dark</p>
                      <MdDarkMode className='mx-2' />
                      <sup style={{ color: '#feae3b' }}>BETA</sup>
                    </div>
                }
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Nav