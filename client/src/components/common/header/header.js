import React from 'react';
import './header.scss';
import laLogo from '../../../assets/images/la-logo.svg';
import stlLogo from '../../../assets/images/stl-logo.svg'
import RedirectLink from '../link/link';
import { useSelector, useDispatch } from 'react-redux';
import allActions from '../../../store/actions';
import { BRIGADE_NAME } from '../../../utils/themes/themes';
import { useState, useEffect } from 'react';

const Header = () => {
  const isMenuOpen = useSelector((state) => state.dashboard.isMenuOpen);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [logo, setLogo] = useState();

  useEffect(() => {
    BRIGADE_NAME === "Hack for LA" ? setLogo(laLogo) : setLogo(stlLogo)
  }, []);

  function toggleMenu() {
    if (!isMenuOpen) {
      dispatch(allActions.dashboardActions.openMenu());
    } else {
      dispatch(allActions.dashboardActions.closeMenu());
    }
  }

  return (
    <header data-testid="header" className="app-header">
      {loggedIn && user ? (
        <div className="menu-button-container">
          <div
            className={isMenuOpen ? 'menu-button active' : 'menu-button'}
            onClick={() => toggleMenu()}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      ) : null}

      <RedirectLink
        linkKey={'header-home-link'}
        path={'/'}
        content={
          <img data-testid="logo" src={logo} className="app-logo" alt="logo" />
        }
      />
    </header>
  );
};

export default Header;
