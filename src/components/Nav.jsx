import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, InputGroup, Input, InputRightAddon, useDisclosure, InputLeftElement, Avatar, InputRightElement } from "@chakra-ui/react" //eslint-disable-line no-unused-vars
import { GiHamburgerMenu } from "react-icons/gi"
import { Link, useNavigate } from "react-router-dom"
import NavState from "../context/NavContext";
import UserState from "../context/UserContext";
import { SearchIcon } from "@chakra-ui/icons"
import ThemeState from "../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Nav = () => {
  const { active, setActive } = NavState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setSearchText } = NavState()
  const { theme, toggleTheme } = ThemeState()
  const themeName = theme === 'dark' ? 'Light' : 'Dark'

  const { user } = UserState()
  const username = (user && user.displayName) || ''
  const navigate = useNavigate()

  return (
    <div className={`nav d-flex flex-row align-items-center justify-content-center shadow-sm p-3 w-100 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      {/*
      <div className="drawer-button d-block d-md-none d-flex flex-row align-items-center me-3">
        <GiHamburgerMenu className='nav-icon' onClick={() => { onOpen() }} />
      </div>
      */}
      <Link to={'/'} onClick={
        () => {
          setActive(['/', 'Notes'])
        }
      } className="branding p-0 m-0 w-25">
        <h6 className="p-0 m-0">🔥Fire Notes</h6>
      </Link>
      <div className="searchbar w-50">
        <InputGroup>
          <InputLeftElement>
            <GiHamburgerMenu className='nav-icon d-block d-md-none' onClick={() => { onOpen() }} />
            <SearchIcon color='grey' className="d-none d-md-block" />
          </InputLeftElement>
          <Input className={theme === 'dark' ? "bg-dark" : ''} border={theme === 'dark' ? '1px' : '0px'} variant='filled' colorScheme="grey" placeholder={active[0] === '/' || active[0] === '/archive' || active[0] === '/trash' || active[0] === '/shared' ? 'Search in ' + active[1] : 'Search'} focusBorderColor="yellow.400" onChange={(e) => { setSearchText(e.target.value) }} />
          <InputRightElement>
            <SearchIcon className="d-block d-md-none bg-dark" />
          </InputRightElement>
        </InputGroup>
      </div>
      <div className="profile w-25 d-flex flex-row justify-content-end align-items-center" style={{ cursor: 'pointer' }} onClick={() => {
        if (user) {
          setActive(['/profile/' + user.displayName, 'Profile'])
          navigate('/profile/:userId' + user.displayName)
        } else {
          setActive(['/', 'Notes'])
          navigate('/login')
        }
      }} >
        <p className="my-0 me-2 d-none d-md-block">{user && user.displayName}</p>
        <Avatar name={user && user.displayName} size='sm' />
      </div>

      {/* Drawer */}
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} className='bg-dark' >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px' className={theme === 'dark' ? "bg-dark text-white" : 'bg-white text-dark'} >
            <h4>🔥Fire Notes</h4>
          </DrawerHeader>
          <DrawerBody className={theme === 'dark' ? "bg-dark text-white m-0 p-0" : 'bg-white text-dark'}>
            <div className="links">
              <ul className="list-unstyled">
                {[['/', 'Notes'], ['/archive', 'Archive'], ['/trash', 'Trash'], ['/profile/' + username, 'Profile']].map(([route, text]) => {
                  return (
                    <Link to={route} onClick={() => {
                      onClose()
                      setActive([route, text])
                    }} key={text}>
                      <p className={`link-drawer px-3 py-3 m-0 ${active[0] === route ? 'link-drawer-active ' : ''}`}>{text}</p>
                    </Link>
                  )
                })}
              </ul>
              <div className="theme px-3 d-flex flex-row align-items-center justify-content-start" style={{ cursor: 'pointer' }}
                onClick={() => { toggleTheme() }}>
                {themeName} {theme === 'dark' ? <MdLightMode className='mx-2' /> : <MdDarkMode className='mx-2' />} <sup style={{ color: '#feae3b' }}>BETA</sup>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div >
  )
}

export default Nav