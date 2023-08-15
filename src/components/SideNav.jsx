import { Link } from 'react-router-dom'
import NavState from "../context/NavContext";
import UserAuth from '../context/UserContext';
import ThemeState from '../context/ThemeContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
// import { useEffect, useState } from 'react';

const SideNav = () => {
  const { active, setActive } = NavState();
  const { user } = UserAuth();
  const { theme, toggleTheme } = ThemeState();

  const themeName = theme === 'dark' ? 'Light' : 'Dark'

  const username = (user && user.displayName) || ''


  return (
    <div className={`side-nav col-2 d-none d-md-block py-4 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="links pe-1">
        <ul className="list-unstyled">
          {[['/', 'Notes'], ['/archive', 'Archive'], ['/trash', 'Trash'], ['/profile/'+username, 'Profile']].map(([route, text]) => {
            return (
              <Link to={route} onClick={() => {
                setActive([route, text])
                console.log(active, route)
              }} key={text}>
                <p className={`link px-3 py-3 m-0 ${active[0] === route ? 'link-active text-dark' : ''}`}>{text}</p>
              </Link>
            )
          })}
        </ul>
        <div className="theme px-3 d-flex flex-row align-items-center justify-content-start" style={{ cursor: 'pointer' }}
          onClick={() => { toggleTheme() }}>
          {themeName} {theme === 'dark' ? <MdLightMode className='mx-2' /> : <MdDarkMode className='mx-2' />} <sup style={{ color: '#feae3b' }}>BETA</sup>
        </div>
      </div>
    </div>
  )
}

export default SideNav