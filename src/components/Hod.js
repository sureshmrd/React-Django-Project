// App component
import React, { useState } from 'react';
import HodLogin from './HodLogin';
import HodDisplay from './HodDisplay';

const Hod = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (username) => {
    setLoggedInUser(username);
  };

  return (
    <div>
      {loggedInUser ? (
        <HodDisplay username={loggedInUser} />
      ) : (
        <HodLogin onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Hod;
