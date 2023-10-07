import { Link } from 'react-router-dom'
import ThemeState from '../context/ThemeContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
// import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SideNav = () => {
  const { theme, toggleTheme } = ThemeState();

  const location = useLocation()
  const page = location.pathname.split('/')
  let pageName = '/'+page[page.length - 1]
  if (pageName === '/notes') {
    pageName = '/'
  } 

  return (
    <div className={`side-nav col-2 d-none d-md-block py-4 ${theme === 'dark' ? 'dark-theme text-white' : 'light-theme'}`}>
      <div className="links pe-1">
        <ul className="list-unstyled">
          {[['/', 'Notes'], ['/shared', 'Shared'], ['/archive', 'Archive'], ['/trash', 'Trash'], ['/profile', 'Profile']].map(([route, text]) => {
            return (
              <Link to={route} key={text}>
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
    </div>
  )
}

export default SideNav