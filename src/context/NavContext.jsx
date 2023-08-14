import propTypes from "prop-types";
import { useContext } from "react";
import { createContext, useState } from "react";

const NavContext = createContext();

export function NavProvider({ children }) {
  NavProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const [active, setActive] = useState(['/', 'Notes'])
  const [searchText, setSearchText] = useState('')

  return (
    <NavContext.Provider value={{ active, setActive, searchText, setSearchText }}>
      {children}
    </NavContext.Provider>
  );
}

const NavState = () => {
  return useContext(NavContext);
}

export default NavState;