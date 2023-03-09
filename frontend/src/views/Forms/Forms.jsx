import React, { useState } from "react";
import "./forms.scss";

const Forms = ({ setHome }) => {
  const [changeForm, setChangeForm] = useState(false);
  const [login, setLogin] = useState("Login");
  const [register, setRegister] = useState("Register");

  function myFunction(message) {
    var x = document.getElementById("snackbar");

    x.className = "show";
    x.innerText = message;

    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  const registerUsers = () => {
    var name =
      document.getElementById("name").value === ""
        ? ""
        : document.getElementById("name").value;
    var email =
      document.getElementById("email").value === ""
        ? ""
        : document.getElementById("email").value;
    var password =
      document.getElementById("password").value.length < 8
        ? ""
        : document.getElementById("password").value;
    if (name !== "" && email !== "" && password !== "") {
      setRegister("Registering")
      fetch("http://localhost:1337/api/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          name: name,
          email: email,
          password: password,
          serverPass: import.meta.env.VITE_APP_SERVER_PASSWORD
        },
      })
        .then((res) => res.json())
        .then(res => {
          if (res.message === "User registered succesfully..." && res.id === 13 && res.statusCode === 201) {
            if (res.password === import.meta.env.VITE_APP_CLIENT_PASSWORD) {
              window.localStorage.setItem(import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN, JSON.stringify(res.credentials.authToken))
              const userAuthToken = window.localStorage.getItem(
                `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
              );
              fetch("http://localhost:1337/api/auth/user", {
                method: "GET",
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json",
                  "auth-token": res.credentials.authToken,
                  "serverPass": import.meta.env.VITE_APP_SERVER_PASSWORD
                },
              })
                .then((res) => res.json())
                .then(res => {
                  if (res.message === "User data fetched successfully..." && res.statusCode === 200 && res.id === 12 && res.password === import.meta.env.VITE_APP_CLIENT_PASSWORD) {
                    window.localStorage.setItem(import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_DETAILS, JSON.stringify(res.data))
                    const userLoggedInData = window.localStorage.getItem(
                      `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_DETAILS}`
                    );
                    setHome(true)
                    setRegister("Registered")
                  } else {
                    setHome(false)
                  }
                })
            } else {
              myFunction("Access denied...")
            }
          } else {
            setRegister("Register")
            myFunction(res.message)
          }
        })
    } else {
      myFunction("Please fill up all the fields....");
    }
  }

  const loginUsers = () => {
    var email =
      document.getElementById("loginEmail").value === ""
        ? ""
        : document.getElementById("loginEmail").value;
    var password =
      document.getElementById("loginPassword").value.length < 8
        ? ""
        : document.getElementById("loginPassword").value;
    if (email !== "" && password !== "") {
      setLogin("Logging")
      fetch("http://localhost:1337/api/auth/login", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          email: email,
          password: password,
          "serverPass": import.meta.env.VITE_APP_SERVER_PASSWORD
        },
      })
        .then((res) => res.json())
        .then(res => {
          if (res.message === "User authenticated succesfully..." && res.id === 13 && res.statusCode === 201) {
            if (res.password === import.meta.env.VITE_APP_CLIENT_PASSWORD) {
              window.localStorage.setItem(import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN, JSON.stringify(res.credentials.authToken))
              const userAuthToken = window.localStorage.getItem(
                `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
              );
              fetch("http://localhost:1337/api/auth/user", {
                method: "GET",
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json",
                  "auth-token": res.credentials.authToken,
                  "serverPass": import.meta.env.VITE_APP_SERVER_PASSWORD
                },
              })
                .then((res) => res.json())
                .then(res => {
                  if (res.message === "User data fetched successfully..." && res.statusCode === 200 && res.id === 12 && res.password === import.meta.env.VITE_APP_CLIENT_PASSWORD) {
                    window.localStorage.setItem(import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_DETAILS, JSON.stringify(res.data))
                    const userLoggedInData = window.localStorage.getItem(
                      `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_DETAILS}`
                    );
                    console.log({ userLoggedInData })
                    setLogin("Logged")
                    setHome(true)
                  } else {
                    setHome(false)
                  }
                })
            } else {
              myFunction("Access denied...")
            }
          } else {
            setLogin("Login")
            myFunction(res.message)
          }
        })
    } else {
      myFunction("Please fill up all the fields....");
    }
  }

  return (
    <div className="app__login__wrapper">
      <div id="snackbar">Some text some message..</div>
      {changeForm ? (
        <div className="center">
          <h1>Register to Idealidad</h1>
          <div className="form">
            <div className="txt_field">
              <input type="text" required id="name" />
              <span></span>
              <label>Name</label>
            </div>
            <div className="txt_field">
              <input type="text" required id="email" />
              <span></span>
              <label>Email</label>
            </div>
            <div className="txt_field">
              <input type="password" required id="password" />
              <span></span>
              <label>Password</label>
            </div>
            <input
              type="submit"
              value={register}
              onClick={registerUsers}
            />
            <div className="signup_link">
              Already a member?{" "}
              <span
                onClick={() => {
                  setChangeForm(false);
                }}
              >
                SignIn
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="center">
          <h1>Login to Idealidad</h1>
          <div className="form">
            <div className="txt_field">
              <input type="text" required id="loginEmail" />
              <span></span>
              <label>Email</label>
            </div>
            <div className="txt_field">
              <input type="password" required id="loginPassword" />
              <span></span>
              <label>Password</label>
            </div>
            <div className="pass">Forgot Password?</div>
            <input
              type="submit"
              value={login}
              onClick={loginUsers}
            />
            <div className="signup_link">
              Not a member?{" "}
              <span
                onClick={() => {
                  setChangeForm(true);
                }}
              >
                SignUp
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;
