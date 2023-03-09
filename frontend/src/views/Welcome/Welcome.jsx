import React, { useState, useEffect } from "react";
import "./welcome.scss";
import { textIcon } from "../../assets";
import Forms from "../Forms/Forms";
import { Home } from "../index";
import io from "socket.io-client";

const socket = io.connect("http://localhost:1337");

const Welcome = () => {
  window.localStorage.setItem(import.meta.env.VITE_APP_USER_WP_SESSION_DATA_TOKEN, 'Un-Authenticated')
  window.localStorage.setItem(import.meta.env.VITE_APP_USER_GS_SESSION_DATA_TOKEN, 'Un-Authenticated')
  window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, 'No-UserData');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [flag, setFlag] = useState(false);
  const [home, setHome] = useState(false);

  setTimeout(() => {
    setShowWelcomeAnimation(false);
  }, 4000);

  useEffect(() => {
    const userAuthToken = JSON.parse(window.localStorage.getItem(
      `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
    ));

    fetch("http://localhost:1337/api/auth/user", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "auth-token": userAuthToken,
        "serverPass": import.meta.env.VITE_APP_SERVER_PASSWORD
      },
    })
      .then((res) => res.json())
      .then(res => {
        if (res.message === "User data fetched successfully..." && res.statusCode === 200 && res.id === 12 && res.password === import.meta.env.VITE_APP_CLIENT_PASSWORD) {
          window.localStorage.setItem(import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_DETAILS, JSON.stringify(res.data))
          setFlag(true)
          userAuthToken === null ? setHome(false) : flag ? setHome(true) : setHome(false);
        } else {
          setFlag(false)
        }
      })
  }, [showWelcomeAnimation]);

  return (
    <>
      <div className="app__flex app__welcome">
        {showWelcomeAnimation ? (
          <div className="app__welcome__animation__wrapper">
            <img src={textIcon} alt="" className="welcome__icon" />
            <div className="load-bar"></div>
          </div>
        ) : home ? (
          <Home setHome={setHome} socket={socket} />
        ) : (
          <Forms socket={socket} setHome={setHome} />
        )}
      </div>
    </>
  );
};

export default Welcome;
