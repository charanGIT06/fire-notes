import propTypes from "prop-types";
import { useContext, createContext, useState } from "react";

const NavContext = createContext();

export function NavProvider({ children }) {
  NavProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const [searchText, setSearchText] = useState('')

  return (
    <NavContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </NavContext.Provider>
  );
}

const NavState = () => {
  return useContext(NavContext);
}

export default NavState;