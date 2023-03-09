import React, { useState, useEffect } from "react";
import { Dashboard, Directory, Funnel, SalesBot, Sidebar } from "../../components";
import Chats from "../../components/Chats/Chats";
import "./home.scss";
import { bell } from '../../assets'
import Analytics from "../../components/Analytics/Analytics";

const Home = ({ setHome, socket, }) => {
  const [displayComponent, setDisplayComponent] = useState("");
  const [permission, setPermission] = useState(false);
  const [wpAuth, setWpAuth] = useState(false)
  const [gsAuth, setGsAuth] = useState(false)
  const [count, setCount] = useState(false)

  function myFunction(message) {
    var x = document.getElementById("snackbar");
    x.className.replace("show", "")
    x.className = "show";

    var y = document.getElementById("messagebox");
    y.innerText = message;

    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  useEffect(() => {
    setTimeout(() => {
      const userAuthToken = (window.localStorage.getItem(
        `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
      ));

      const userLoggedInData = window.localStorage.getItem(
        `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_DETAILS}`
      );

      if (!count) {
        const jsonData = JSON.parse(userLoggedInData)
        if (jsonData._wpIntegration) {
          setWpAuth(false)
        } else {
          setWpAuth(true)
        }
        setDisplayComponent("dashboard")
        setCount(true)
      }

      userAuthToken === null ? setHome(false) : userLoggedInData === null ? setHome(false) : null
    }, 1000)
  }, [])

  // useEffect(() => {
  //   .on("whatsapp_message", ({ password, chat }) => {
  //     if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
  //       myFunction(`New Messages From ${chat._chatName}`)
  //     }
  //   })
  // })


  return (
    <div className="app__home">
      <div id="snackbar">
        <img src={bell} alt="" />
        <span id="messagebox">Hello</span>
      </div>
      <Sidebar
        setDisplayComponent={setDisplayComponent}
        displayComponent={displayComponent}
      />
      {displayComponent === "dashboard" ? (
        <Dashboard socket={socket} gsAuth={gsAuth} setGsAuth={setGsAuth} setPermission={setPermission} wpAuth={wpAuth} setWpAuth={setWpAuth} />
      ) : displayComponent === "funnels" ? (
        <Funnel socket={socket} permission={permission} />
      ) : displayComponent === "directory" ? (
        <Directory socket={socket} permission={permission} />
      ) : displayComponent === "chats" ? (
        <Chats socket={socket} permission={permission} />
      ) : displayComponent === "salesbot" ? (
        <SalesBot socket={socket} />
      ) : displayComponent === "analytics" ? (<Analytics socket={socket} />) : ""}
    </div>
  );
};

export default Home;
