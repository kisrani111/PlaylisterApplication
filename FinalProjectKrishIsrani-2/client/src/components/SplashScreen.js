import { useHistory } from "react-router-dom";
import { useContext } from "react";
import AuthContext from '../auth';

export default function SplashScreen() {
  const history = useHistory();
  const { auth } = useContext(AuthContext);

  function handleRegister() {
    history.push("/register/");
  }

  function handleLogin() {
    history.push("/login/");
  }
  const handleGuestLogIn = () => {
    history.push("/");
    auth.loginGuest();
}

  return (
    <div id='splash-screen'>
      <div id='splash-screen-logo'>Playlister</div>
      <h1>Welcome to the Playlister Application</h1>
      <p>
      The best application to edit, view and share your favorite songs.
      </p>
      <p>
      Create a free account and take advantage of the numerous features this application offers. 
      </p>
      <div id='splash-screen-button'>
        <button
          className='button' id='register-button' type='button' onClick={handleRegister}>
          REGISTER
        </button>
        <button className='button' id='login-button' type="button" onClick={handleLogin}>
          LOGIN
        </button>
        <button className='button' id='guest-button' type="button" onClick={handleGuestLogIn}>
          GUEST
        </button>
      </div>
    </div>
  );
}
