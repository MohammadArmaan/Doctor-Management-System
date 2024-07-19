/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import Logout from './Logout';

const Header = ({ user, toggleTheme, theme, setUser }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav__list">
          <li className="list__icons">
            {theme === 'light' ? (
              <FaMoon className="theme-icons dark" onClick={toggleTheme} />
            ) : (
              <FaSun className="theme-icons light" onClick={toggleTheme} />
            )}
          </li>

          {user && user.id && user.id.role === "doctor" && (
            <li className="nav__list">
              <Link className="nav__link" to="/doctorPatientLink">
                Link&nbsp;Patient
              </Link>
            </li>
          )}

          {!user ? (
            <Link className="nav__links login__link" to="/login">Login/Sign up</Link>
          ) : (
            <Logout setUser={setUser}/>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
