import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import rigoImageUrl from '../../img/rigo-baby.jpg';
import '../../styles/home.css';

export const Login = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    actions.login (email, password);
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  if (store.token && store.token !== '' && store.token !== undefined) {
    navigate('/private');
  }

  return (
    <div className="text-center mt-5">
      <h1>Hello Rigo!!</h1>
      <p>
        <img src={rigoImageUrl} alt="Rigo" />
      </p>
      <h1>Login</h1>
      {store.token && store.token !== '' && store.token !== undefined ? (
        <p>You are logged in with this token: {store.token}</p>
      ) : (
        <div>
          <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleClick}>Login</button>
          <p className="mt-3">Don't have an account? </p>
          <button className="btn btn-primary" onClick={handleSignupClick}>Sign up</button>
        </div>
      )}
    </div>
  );
};