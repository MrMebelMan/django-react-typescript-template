import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { Masthead } from './Masthead';
import { Features } from './Features';
import { PageWrapper } from 'app/components/PageWrapper';
import { checkIsLoggedIn } from 'app/utils';

export function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const checkLoggedIn = async () => {
    const loggedIn = await checkIsLoggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn === false) {
      window.location.href = '/login';
    }
  };

  React.useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <>
      {isLoggedIn && (
        <>
          <Helmet>
            <title>Home Page</title>
            <meta
              name="description"
              content="A React Boilerplate application homepage"
            />
          </Helmet>
          <NavBar />
          <PageWrapper>
            <Masthead />
            <Features />
          </PageWrapper>
        </>
      )}
    </>
  );
}
