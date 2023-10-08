import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  InputGroup,
  Input,
  InputRightAddon,
  useDisclosure,
  InputLeftElement,
  Avatar,
  InputRightElement,
} from "@chakra-ui/react"; //eslint-disable-line no-unused-vars
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import NavState from "../../context/NavContext";
import UserState from "../../context/UserContext";
import { SearchIcon } from "@chakra-ui/icons";
import ThemeState from "../../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocation } from "react-router-dom";
import "../../scss/index.scss";

const Nav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setSearchText } = NavState();
  const { theme, toggleTheme } = ThemeState();
  const { user } = UserState();
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/");
  let pageName = "/" + page[page.length - 1];
  if (pageName === "/notes") {
    pageName = "/";
  }

  return (
    <>
      <div className={`nav ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
        <div className='big-screens d-none d-md-block w-100 p-2'>
          <div className='d-flex flex-row align-items-center w-100 py-3 px-3'>
            <Link to={"/"} className='w-25'>
              🔥Fire Notes
            </Link>
            <div
              className={`searchbar w-50 d-flex flex-row align-items-center p-2 ${
                theme === "dark" ? "dark-element" : "light-element"
              }`}
              style={{ borderRadius: "25px" }}
            >
              <SearchIcon color='grey' className='mx-2' />
              <Input
                type='text'
                variant='unstyled'
                placeholder='Search'
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            </div>
            <div className='w-25 d-flex flex-row justify-content-end align-items-center'>
              <div
                className='account d-flex flex-row align-items-center p-2'
                style={{ borderRadius: "50px", cursor: "pointer" }}
                onClick={() => {
                  if (user && user.uid !== undefined) {
                    navigate("/profile");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <p className='my-0 me-2'>
                  {(user && user.displayName) || "Login"}
                </p>
                <Avatar name={user && user.displayName} size='sm' />
              </div>
            </div>
          </div>
        </div>
        <div className='mobile d-block d-md-none px-2 py-3 w-100'>
          <div
            className={`search-bar d-flex flex-row align-items-center w-100 p-2 ${
              theme === "dark" ? "dark-element" : "light-element"
            }`}
            style={{ borderRadius: "25px" }}
          >
            <GiHamburgerMenu
              className='nav-icon ms-2'
              size='1.5rem'
              color={`${theme === "dark" ? "#ADB5BD" : "#495057"}`}
              onClick={() => {
                onOpen();
              }}
            />
            <Input
              type='text'
              variant='unstyled'
              className='mx-3'
              placeholder='Search'
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <Avatar
              name={user && user.displayName}
              size='sm'
              onClick={() => {
                if (user) {
                  navigate("/profile");
                } else {
                  navigate("/login");
                }
              }}
            />
          </div>
        </div>
      </div>
      <Drawer
        placement={"left"}
        onClose={onClose}
        isOpen={isOpen}
        className='bg-dark'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth='1px'
            className={
              theme === "dark" ? "dark-theme" : "light-theme text-dark"
            }
          >
            <h4>🔥Fire Notes</h4>
          </DrawerHeader>
          <DrawerBody
            className={
              theme === "dark"
                ? "dark-theme text-white m-0 p-0"
                : "light-theme text-dark m-0 p-0"
            }
          >
            <div className='links'>
              <ul className='list-unstyled'>
                {[
                  ["/", "Notes"],
                  ["/tasks", "Tasks"],
                  ["/shared", "Shared"],
                  ["/archive", "Archive"],
                  ["/trash", "Trash"],
                  ["/profile", "Profile"],
                ].map(([route, text]) => {
                  return (
                    <Link
                      to={route}
                      key={text}
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <p
                        className={`link px-3 py-3 m-0 ${
                          pageName === route ? "link-active text-dark" : ""
                        }`}
                      >
                        {text}
                      </p>
                    </Link>
                  );
                })}
              </ul>
              <div
                className='theme px-3 d-flex flex-row align-items-center justify-content-start'
                style={{ cursor: "pointer" }}
                onClick={() => {
                  toggleTheme();
                }}
              >
                {theme === "dark" ? (
                  <div className='light d-flex flex-row align-items-center'>
                    <p className='m-0 p-0'>Light</p>
                    <MdLightMode className='mx-2' />
                    <sup style={{ color: "#feae3b" }}>BETA</sup>
                  </div>
                ) : (
                  <div className='dark d-flex flex-row align-items-center'>
                    <p className='m-0 p-0'>Dark</p>
                    <MdDarkMode className='mx-2' />
                    <sup style={{ color: "#feae3b" }}>BETA</sup>
                  </div>
                )}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Nav;
