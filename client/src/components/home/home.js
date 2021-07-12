import React from 'react';
import './home.scss';
import Button from '../common/button/button';
import RedirectLink from '../common/link/link';
import Title from '../common/title/title';

const Home = () => {
  return (
    <section data-testid="home" className="flex-container home">
      <Title />

      <RedirectLink
        path={'/login'}
        content={<Button content={`Sign in`} className={`home-button`} />}
        linkKey={'sign-in-link'}
      />

      <span className="home-text">or</span>

      <RedirectLink
        path={'/create-account'}
        content={'Create account'}
        className={'accent-link'}
        linkKey={'create-account'}
      />
    </section>
  );
};

export default Home;
