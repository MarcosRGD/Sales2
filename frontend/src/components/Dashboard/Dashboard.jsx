import React, { useEffect, useState } from "react";
import {
  brokenLink,
  exit,
  facebook,
  instagram,
  integration,
  link,
  management,
  plus,
  sheets,
  teamwork,
  bell,
  user,
  whatsapp,
  hourglass,
  messenger
} from "../../assets";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "./dashboard.scss";
import { Footer, WhatsappModal, TeamModal, GoogleSheetsModal, FacebookModal } from "../index";
import AuthModal from "../AuthModal/AuthModal";
import InstagramModal from "../InstagramModal/InstagramModal";
import MessengerModal from "../MessengerModal/MessengerModal";

ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = ({ socket, setPermission, wpAuth, setWpAuth, gsAuth, setGsAuth }) => {
  const [showWpModal, setShowWpModal] = useState(false);
  const [showFbModal, setShowFbModal] = useState(false);
  const [showIgModal, setShowIgModal] = useState(false);
  const [showMsModal, setShowMsModal] = useState(false);
  const [showGsModal, setShowGsModal] = useState(false);
  const [wpLoading, setWpLoading] = useState(false);
  const [gsReq, setGsReq] = useState(true);
  const [gsLoading, setGsLoading] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [fetchTeam, setFetchTeam] = useState(false);
  const [fetchWp, setFetchWp] = useState(true);
  const [fetchWpTeam, setFetchWpTeam] = useState(false);
  const [fetchGs, setFetchGs] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [teamRole, setTeamRole] = useState("neutral");
  const [teamId, setTeamId] = useState("");
  const [id, setId] = useState("");
  const [messagesSentGraphData, setMessagesSentGraphData] = useState([
    0, 0, 0, 0, 0, 0, 0
  ]);
  const [leadsGainedGraphData, setLeadsGainedGraphData] = useState([
    0, 0, 0, 0, 0, 0, 0
  ]);
  const [teamMessagesSentGraphData, setTeamMessagesSentGraphData] = useState([
    0, 0, 0, 0, 0, 0, 0
  ]);
  const [teamLeadsGainedGraphData, setTeamLeadsGainedGraphData] = useState([
    0, 0, 0, 0, 0, 0, 0
  ]);
  const d = new Date();
  const [date, setDate] = useState("");
  const userAuthToken = JSON.parse(window.localStorage.getItem(
    import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN
  ));
  const [userData, setUserData] = useState({
    _id: "",
    _name: "User",
    _email: "",
    _teamId: "",
    _teamRole: "neutral",
    _gsIntegration: false,
    _gsSessionData: "",
    _wpIntegration: false,
    _wpSessionData: "",
    _fbIntegration: false,
    _fbSessionData: "",
    _igIntegration: false,
    _igSessionData: "",
    _totalMessagesSent: 0,
    _totalLeadsGained: 0,
    _totalMessagesSentThisWeek: [],
    _totalLeadsGainedThisWeek: [],
    _funnelsCount: 0,
    _funnels: [],
    _teamChats: [],
    _ownChats: [],
    _assignedChats: []
  });
  const [userTeamData, setUserTeamData] = useState({
    _id: "",
    _teamName: "Your team",
    _teamAdmin: "",
    _teamMembers: [],
    _totalMessagesSent: 0,
    _totalLeadsGained: 0,
    _totalMessagesSentThisWeek: [],
    _totalLeadsGainedThisWeek: [],
    _teamChats: [],
    _teamWpIntegration: false
  })

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
    setDate(d.toString())

    if (!wpAuth) {
      var dashboard = document.getElementById('dashboard')
      dashboard.style.overflow = "hidden"
    } else if (wpAuth) {
      var dashboard = document.getElementById('dashboard')
      dashboard.style.overflow = "scroll"
    }

    socket.emit("get_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
      if (err) {
        myFunction(err)
      }
    })

    fetchTeam ? socket.emit("get_user_team", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, teamId }, (err) => {
      if (err) {
        myFunction(err)
      }
    }) : setFetchTeam(false)

    const authWp = () => {
      console.log(wpAuth)
      if (!wpAuth || fetchWpTeam) {
        const token = window.localStorage.getItem(import.meta.env.VITE_APP_USER_WP_SESSION_DATA_TOKEN)
        if (token !== 'Authenticated' && token !== 'In-Progress') {
          setWpLoading(true)
          console.log(wpAuth)
          setShowAuthModal(true)
          socket.emit("authenticate_whatsapp", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
            if (err) {
              window.localStorage.setItem(import.meta.env.VITE_APP_USER_WP_SESSION_DATA_TOKEN, 'Un-Authenticated')
              setWpLoading(false)
              setShowAuthModal(false)
              setWpAuth(false)
              myFunction(err)
            }
          })
          window.localStorage.setItem(import.meta.env.VITE_APP_USER_WP_SESSION_DATA_TOKEN, "In-Progress")
        }
      }
    }

    fetchWp ? authWp() : setWpLoading(false)

    const authGs = () => {
      if (!gsAuth) {
        const token = window.localStorage.getItem(import.meta.env.VITE_APP_USER_GS_SESSION_DATA_TOKEN)
        if (token !== 'Authenticated') {
          setGsLoading(true)
          socket.emit("authenticate_googlesheets", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
            if (err) {
              window.localStorage.setItem(import.meta.env.VITE_APP_USER_GS_SESSION_DATA_TOKEN, 'Un-Authenticated')
              setGsAuth(false)
              setGsLoading(false)
              myFunction(err)
            }
          })
        }
      }
    }

    fetchGs ? authGs() : setGsLoading(false)

  }, [fetchTeam, fetchGs, fetchWp])


  useEffect(() => {
    socket.on("got_user", ({ user, password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setTeamId(user._teamId)
        setTeamRole(user._teamRole)
        setId(user._id)
        setUserData({
          _id: user._id,
          _name: user._name,
          _email: user._email,
          _teamId: user._teamId,
          _teamRole: user._teamRole,
          _gsIntegration: user._gsIntegration,
          _gsSessionData: user._gsSessionData,
          _wpIntegration: user._wpIntegration,
          _wpSessionData: user._wpSessionData,
          _fbIntegration: user._fbIntegration,
          _fbSessionData: user._fbSessionData,
          _igIntegration: user._igIntegration,
          _igSessionData: user._igSessionData,
          _totalMessagesSent: user._totalMessagesSent,
          _totalLeadsGained: user._totalLeadsGained,
          _totalMessagesSentThisWeek: JSON.parse(user._totalMessagesSentThisWeek),
          _totalLeadsGainedThisWeek: JSON.parse(user._totalLeadsGainedThisWeek),
          _funnelsCount: user._funnelsCount,
          _funnels: user._funnels,
          _teamChats: user._teamChats,
          _ownChats: user._ownChats,
          _assignedChats: user._assignedChats
        })

        setMessagesSentGraphData([
          JSON.parse(user._totalMessagesSentThisWeek)[0].chats,
          JSON.parse(user._totalMessagesSentThisWeek)[1].chats,
          JSON.parse(user._totalMessagesSentThisWeek)[2].chats,
          JSON.parse(user._totalMessagesSentThisWeek)[3].chats,
          JSON.parse(user._totalMessagesSentThisWeek)[4].chats,
          JSON.parse(user._totalMessagesSentThisWeek)[5].chats,
          JSON.parse(user._totalMessagesSentThisWeek)[6].chats,
        ])
        setLeadsGainedGraphData([
          JSON.parse(user._totalLeadsGainedThisWeek)[0].leads,
          JSON.parse(user._totalLeadsGainedThisWeek)[1].leads,
          JSON.parse(user._totalLeadsGainedThisWeek)[2].leads,
          JSON.parse(user._totalLeadsGainedThisWeek)[3].leads,
          JSON.parse(user._totalLeadsGainedThisWeek)[4].leads,
          JSON.parse(user._totalLeadsGainedThisWeek)[5].leads,
          JSON.parse(user._totalLeadsGainedThisWeek)[6].leads,
        ])

        if (user._teamId !== "" && user._teamRole !== "neutral") {
          setFetchTeam(true)
        } else {
          setFetchTeam(false)
        }

        if (user._wpIntegration && user._wpSessionData !== "") {
          if (!fetchWp) {
            setFetchWp(true)
          }
        } else {
          setFetchWp(false)
        }

        if (user._gsIntegration && user._gsSessionData !== "") {
          setFetchGs(true)
        } else {
          setFetchGs(false)
        }
      }
    })

    socket.on("got_user_team", ({ team, password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setUserTeamData({
          _id: team._id,
          _teamAdmin: team._teamAdmin,
          _teamMembers: team._teamMembers,
          _teamName: team._teamName,
          _totalMessagesSent: team._totalMessagesSent,
          _totalLeadsGained: team._totalLeadsGained,
          _totalMessagesSentThisWeek: JSON.parse(team._totalMessagesSentThisWeek),
          _totalLeadsGainedThisWeek: JSON.parse(team._totalLeadsGainedThisWeek),
          _teamChats: team._teamChats,
          _teamWpIntegration: team._teamWpIntegration
        })

        if (team._teamWpIntegration && team._teamAdmin !== userData._id) {
          if (!fetchWp) {
            setFetchWpTeam(true)
            setFetchWp(true)
          }
        } else {
          setFetchWpTeam(false)
          setFetchWp(false)
        }


        // setTeamMessagesSentGraphData([
        //   JSON.parse(team._totalMessagesSentThisWeek)[0].chats,
        //   JSON.parse(team._totalMessagesSentThisWeek)[1].chats,
        //   JSON.parse(team._totalMessagesSentThisWeek)[2].chats,
        //   JSON.parse(team._totalMessagesSentThisWeek)[3].chats,
        //   JSON.parse(team._totalMessagesSentThisWeek)[4].chats,
        //   JSON.parse(team._totalMessagesSentThisWeek)[5].chats,
        //   JSON.parse(team._totalMessagesSentThisWeek)[6].chats,
        // ])
        // setTeamLeadsGainedGraphData([
        //   JSON.parse(team._totalLeadsGainedThisWeek)[0].leads,
        //   JSON.parse(team._totalLeadsGainedThisWeek)[1].leads,
        //   JSON.parse(team._totalLeadsGainedThisWeek)[2].leads,
        //   JSON.parse(team._totalLeadsGainedThisWeek)[3].leads,
        //   JSON.parse(team._totalLeadsGainedThisWeek)[4].leads,
        //   JSON.parse(team._totalLeadsGainedThisWeek)[5].leads,
        //   JSON.parse(team._totalLeadsGainedThisWeek)[6].leads,
        // ])
      }
    })

    socket.on("joined_team", ({ password, updatedTeam }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction("Team joined succesfully...")
        setUserTeamData({
          _id: updatedTeam._id,
          _teamAdmin: updatedTeam._teamAdmin,
          _teamMembers: updatedTeam._teamMembers,
          _teamName: updatedTeam._teamName,
          _teamChats: updatedTeam._teamChats,
          _teamWpIntegration: team._teamWpIntegration,
          _totalMessagesSent: updatedTeam._totalMessagesSent,
          _totalLeadsGained: updatedTeam._totalLeadsGained,
          _totalMessagesSentThisWeek: JSON.parse(updatedTeam._totalMessagesSentThisWeek),
          _totalLeadsGainedThisWeek: JSON.parse(updatedTeam._totalLeadsGainedThisWeek),
        })


        if (team._teamWpIntegration && team._teamAdmin !== userData._id) {
          if (!fetchWp) {
            setFetchWpTeam(true)
            setFetchWp(true)
          }
        } else {
          setFetchWpTeam(false)
          setFetchWp(false)
        }

        // setTeamMessagesSentGraphData([
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[0].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[1].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[2].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[3].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[4].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[5].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[6].chats,
        // ])
        // setTeamLeadsGainedGraphData([
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[0].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[1].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[2].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[3].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[4].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[5].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[6].leads,
        // ])
      }
    })

    socket.on("team_updated", ({ password, updatedTeam }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        const checkUser = (user) => {
          return user.id === id;
        }
        if (updatedTeam._teamMembers.find(checkUser)) {
          setUserTeamData({
            _id: updatedTeam._id,
            _teamAdmin: updatedTeam._teamAdmin,
            _teamWpIntegration: team._teamWpIntegration,
            _teamMembers: updatedTeam._teamMembers,
            _teamName: updatedTeam._teamName,
            _teamChats: updatedTeam._teamChats,
            _totalMessagesSent: updatedTeam._totalMessagesSent,
            _totalLeadsGained: updatedTeam._totalLeadsGained,
            _totalMessagesSentThisWeek: JSON.parse(updatedTeam._totalMessagesSentThisWeek),
            _totalLeadsGainedThisWeek: JSON.parse(updatedTeam._totalLeadsGainedThisWeek),
          })


          if (team._teamWpIntegration && team._teamAdmin !== userData._id) {
            if (!fetchWp) {
              setFetchWpTeam(true)
              setFetchWp(true)
            }
          } else {
            setFetchWpTeam(false)
            setFetchWp(false)
          }
        }

        // setTeamMessagesSentGraphData([
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[0].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[1].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[2].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[3].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[4].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[5].chats,
        //   JSON.parse(updatedTeam._totalMessagesSentThisWeek)[6].chats,
        // ])
        // setTeamLeadsGainedGraphData([
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[0].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[1].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[2].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[3].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[4].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[5].leads,
        //   JSON.parse(updatedTeam._totalLeadsGainedThisWeek)[6].leads,
        // ])
      }
    })

    socket.on("member_added", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction("Member added to team...")
      }
    })

    socket.on("sheets_integrated", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        window.localStorage.setItem(import.meta.env.VITE_APP_USER_GS_SESSION_DATA_TOKEN, 'Authenticated')
        setGsLoading(false)
        setGsReq(false)
        setGsAuth(true)
        myFunction("Google sheets integrated...")
      }
    })

    socket.on("sheets_authenticated", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        window.localStorage.setItem(import.meta.env.VITE_APP_USER_GS_SESSION_DATA_TOKEN, 'Authenticated')
        setGsLoading(false)
        setGsReq(false)
        setGsAuth(true)
        myFunction("Google sheets integrated...")
      }
    })

    socket.on("registered_user_team", ({ password, newTeam }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction("Team created succesfully...")
        setUserTeamData({
          _id: newTeam._id,
          _teamAdmin: newTeam._teamAdmin,
          _teamMembers: newTeam._teamMembers,
          _teamWpIntegration: team._teamWpIntegration,
          _teamName: newTeam._teamName,
          _teamChats: newTeam._teamChats,
          _totalMessagesSent: newTeam._totalMessagesSent,
          _totalLeadsGained: newTeam._totalLeadsGained,
          _totalMessagesSentThisWeek: JSON.parse(newTeam._totalMessagesSentThisWeek),
          _totalLeadsGainedThisWeek: JSON.parse(newTeam._totalLeadsGainedThisWeek),
        })
      }
    })

    socket.on("left_team", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction("Team left succesfully...")
        setUserTeamData({
          _id: "",
          _teamName: "Your team",
          _teamAdmin: "",
          _teamWpIntegration: false,
          _teamMembers: [],
          _totalMessagesSent: 0,
          _totalLeadsGained: 0,
          _totalMessagesSentThisWeek: [],
          _totalLeadsGainedThisWeek: [],
          _teamChats: []
        })
      }
    })

    socket.on("user_updated", ({ updatedUser, password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setTeamId(updatedUser._teamId)
        setTeamRole(updatedUser._teamRole)
        setId(updatedUser._id)
        setUserData({
          _id: updatedUser._id,
          _name: updatedUser._name,
          _email: updatedUser._email,
          _teamId: updatedUser._teamId,
          _teamRole: updatedUser._teamRole,
          _gsIntegration: updatedUser._gsIntegration,
          _gsSessionData: updatedUser._gsSessionData,
          _wpIntegration: updatedUser._wpIntegration,
          _wpSessionData: updatedUser._wpSessionData,
          _fbIntegration: updatedUser._fbIntegration,
          _fbSessionData: updatedUser._fbSessionData,
          _igIntegration: updatedUser._igIntegration,
          _igSessionData: updatedUser._igSessionData,
          _totalMessagesSent: updatedUser._totalMessagesSent,
          _totalLeadsGained: updatedUser._totalLeadsGained,
          _totalMessagesSentThisWeek: JSON.parse(updatedUser._totalMessagesSentThisWeek),
          _totalLeadsGainedThisWeek: JSON.parse(updatedUser._totalLeadsGainedThisWeek),
          _funnelsCount: updatedUser._funnelsCount,
          _funnels: updatedUser._funnels,
          _teamChats: updatedUser._teamChats,
          _ownChats: updatedUser._ownChats,
          _assignedChats: updatedUser._assignedChats
        })

        setMessagesSentGraphData([
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[0].chats,
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[1].chats,
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[2].chats,
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[3].chats,
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[4].chats,
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[5].chats,
          JSON.parse(updatedUser._totalMessagesSentThisWeek)[6].chats,
        ])
        setLeadsGainedGraphData([
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[0].leads,
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[1].leads,
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[2].leads,
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[3].leads,
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[4].leads,
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[5].leads,
          JSON.parse(updatedUser._totalLeadsGainedThisWeek)[6].leads,
        ])

        if (updatedUser._teamId !== "" && updatedUser._teamRole !== "neutral") {
          setFetchTeam(true)
        } else {
          setFetchTeam(false)
        }



        if (updatedUser._wpIntegration && updatedUser._wpSessionData !== "") {
          if (!fetchWp) {
            setFetchWp(true)
          }
        } else {
          setFetchWp(false)
        }

        if (updatedUser._gsIntegration && updatedUser._gsSessionData !== "") {
          if (!fetchGs) {
            setFetchGs(true)
          }
        } else {
          setFetchGs(false)
        }
      }
    })

    socket.on("whatsapp_integrated", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        window.localStorage.setItem(import.meta.env.VITE_APP_USER_WP_SESSION_DATA_TOKEN, 'Authenticated')
        setWpLoading(false)
        setPermission(true)
        setFetchWp(false)
        setWpAuth(true)
        myFunction("Whatsapp integrated succesfully...")
      }
    })

    socket.on("whatsapp_authenticated", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        window.localStorage.setItem(import.meta.env.VITE_APP_USER_WP_SESSION_DATA_TOKEN, 'Authenticated')
        setWpLoading(false)
        setPermission(true)
        setWpAuth(true)
        setShowAuthModal(false)
        setFetchWp(false)
        myFunction("Whatsapp authenticated succesfully...")
      }
    })
  })

  const emitWpIntegrationRequest = async () => {
    if (!userData._wpIntegration && userData._wpSessionData === "") {
      setWpLoading(true)
      socket.emit("integrate_whatsapp", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
        setWpLoading(false)
        if (err) {
          setWpAuth(false)
          setWpLoading(false)
          myFunction(err)
        }
      })
    }
  }

  return (
    <div className="app__dashboard" id="dashboard">
      <div id="snackbar">
        <img src={bell} alt="" />
        <span id="messagebox">Hello</span>
      </div>

      <AuthModal showModal={showAuthModal} />

      <WhatsappModal
        showWpModal={showWpModal}
        setShowWpModal={setShowWpModal}
        socket={socket}
        user={userData}
      />

      <FacebookModal
        showFbModal={showFbModal}
        setShowFbModal={setShowFbModal}
        socket={socket}
        user={userData}
        authToken={userAuthToken}
      />

      <GoogleSheetsModal
        showGsModal={showGsModal}
        setShowGsModal={setShowGsModal}
        socket={socket}
        authToken={userAuthToken}
        user={userData}
        userTeam={userTeamData}
      />

      <InstagramModal showFbModal={showIgModal}
        setShowFbModal={setShowIgModal}
        socket={socket}
        user={userData}
        authToken={userAuthToken} />

      <MessengerModal showFbModal={showMsModal}
        setShowFbModal={setShowMsModal}
        socket={socket}
        user={userData}
        authToken={userAuthToken} />

      <TeamModal showTeamModal={showTeamModal} setShowTeamModal={setShowTeamModal} userRole={teamRole} userAuthToken={JSON.parse(window.localStorage.getItem(
        `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
      ))} teamId={teamId} socket={socket} />

      <div className="app__dashboard__header">
        <div className="welcome__text__wrapper">
          <span className="userName">Hi {userData._name.substring(0, userData._name.indexOf(" "))} 👋</span>
          <span className="welcome">Welcome to Idealidad!</span>
        </div>
        <div className="date__wrapper">
          <span className="date">{date}</span>
        </div>
      </div>
      <div className="app__dashboard__body">

        {
          teamRole !== "dead" ? <div className="app__dashboard__body__flex">
            <div className="sales__info__wrapper" id="ml-0">
              <span className="sales__header">Messages sent by you</span>
              <span className="sales__count">{userData._totalMessagesSentThisWeek.length > 0 ? userData._totalMessagesSentThisWeek[7].total : "0"}</span>
              <span className="sales__header">+{userData._totalMessagesSentThisWeek.length > 0 ? userData._totalMessagesSentThisWeek[d.getDay()].chats : "0"} Today</span>
            </div>
            <div className="sales__info__wrapper mr-0">
              <span className="sales__header">Leads gained by you</span>
              <span className="sales__count">{userData._totalLeadsGainedThisWeek.length > 0 ? userData._totalLeadsGainedThisWeek[7].total : "0"}</span>
              <span className="sales__header">+{userData._totalLeadsGainedThisWeek.length > 0 ? userData._totalLeadsGainedThisWeek[d.getDay()].leads : "0"} Today</span>
            </div> </div> : myFunction("Resource corrupted...")
        }

        {
          teamRole !== "dead" ? <div className="app__dashboard__body__chart">
            <Line
              data={{
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [
                  {
                    label: "Messages Sent By You This Week",
                    data: messagesSentGraphData,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                      "rgba(255, 205, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                    ],
                    borderColor: [
                      "rgb(255, 99, 132)",
                      "rgb(255, 159, 64)",
                      "rgb(255, 205, 86)",
                      "rgb(75, 192, 192)",
                      "rgb(54, 162, 235)",
                      "rgb(153, 102, 255)",
                      "rgb(201, 203, 207)",
                    ],
                    borderWidth: 1,
                  },
                  {
                    label: "Leads Gained By You This Week",
                    data: leadsGainedGraphData,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                      "rgba(255, 205, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                    ],
                    borderColor: [
                      "rgb(255, 99, 132)",
                      "rgb(255, 159, 64)",
                      "rgb(255, 205, 86)",
                      "rgb(75, 192, 192)",
                      "rgb(54, 162, 235)",
                      "rgb(153, 102, 255)",
                      "rgb(201, 203, 207)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div> : myFunction("Resource corrupted...")
        }

        <div className="app__dashboard__body__flex">
          <div className="app__dashboard__containers small__flex">
            <span className="app__dashboard__body__flex__header">
              Integrations
              <img src={integration} alt="" className="extra__small mr-10" />
            </span>
            <div className="integration__wrapper">
              <div className="integration" onClick={() => {
                setShowGsModal(true);
              }}>
                <img src={sheets} alt="" className="small" /> Sheets
                <img
                  src={gsLoading ? hourglass : userData._gsIntegration ? link : brokenLink}
                  alt=""
                  className={`extra__small linked__icon ${gsLoading ? "rotate" : ""}`}
                  title="Link Google Sheets"
                />
              </div>
              <div
                className="integration"
                onClick={() => {
                  emitWpIntegrationRequest()
                  setShowWpModal(true);
                }}
              >
                <img src={whatsapp} alt="" className="small" /> Whatsapp
                <img
                  src={wpLoading ? hourglass : userData._teamId !== "" ? userTeamData._teamWpIntegration ? link : brokenLink : userData._wpIntegration ? link : brokenLink}
                  alt=""
                  className={`extra__small linked__icon ${wpLoading ? "rotate" : ""}`}
                  title="Link Whatsapp"
                />
              </div>
              <div className="integration" onClick={() => {
                setShowFbModal(true)
              }}>
                <img src={facebook} alt="" className="small" /> Facebook
                <img
                  src={userData._teamRole === "neutral" ? userData._teamId === "" ? userData._fbIntegration ? link : brokenLink : myFunction("Resource corrupted...") : userData._teamRole === "admin" ? userData._teamId !== "" ? userTeamData._fbIntegration ? link : brokenLink : myFunction("Resource corrupted...") : userData._teamRole === "seller" ? userData._teamId !== "" ? userTeamData._fbIntegration ? link : brokenLink : myFunction("Resource corrupted...") : myFunction("Resource corrupted...")}
                  alt=""
                  className="extra__small linked__icon"
                  title="Link Facebook Messenger"
                />
              </div>
              <div className="integration" onClick={() => {
                setShowMsModal(true)
              }}>
                <img src={messenger} alt="" className="small" /> Messenger
                <img
                  src={userData._teamRole === "neutral" ? userData._teamId === "" ? userData._igIntegration ? link : brokenLink : myFunction("Resource corrupted...") : userData._teamRole === "admin" ? userData._teamId !== "" ? userTeamData._igIntegration ? link : brokenLink : myFunction("Resource corrupted...") : userData._teamRole === "seller" ? userData._teamId !== "" ? userTeamData._igIntegration ? link : brokenLink : myFunction("Resource corrupted...") : myFunction("Resource corrupted...")}
                  alt=""
                  className="extra__small linked__icon"
                  title="Link Instagram"
                />
              </div>
              <div className="integration" onClick={() => {
                setShowIgModal(true)
              }}>
                <img src={instagram} alt="" className="small" /> Instagram
                <img
                  src={userData._teamRole === "neutral" ? userData._teamId === "" ? userData._igIntegration ? link : brokenLink : myFunction("Resource corrupted...") : userData._teamRole === "admin" ? userData._teamId !== "" ? userTeamData._igIntegration ? link : brokenLink : myFunction("Resource corrupted...") : userData._teamRole === "seller" ? userData._teamId !== "" ? userTeamData._igIntegration ? link : brokenLink : myFunction("Resource corrupted...") : myFunction("Resource corrupted...")}
                  alt=""
                  className="extra__small linked__icon"
                  title="Link Instagram"
                />
              </div>
            </div>
          </div>
          <div className="app__dashboard__containers">
            <span className="app__dashboard__body__flex__header">
              {userTeamData._teamName}
              <img src={teamwork} alt="" className="extra__small mr-10" />
              {
                teamRole === "seller" ? <img
                  src={exit}
                  alt=""
                  className="linked__icon w-20"
                  title="Add More Members To Your Team"
                  onClick={() => {
                    setShowTeamModal(true)
                  }}
                /> : <img
                  src={plus}
                  alt=""
                  className="linked__icon w-20"
                  title="Exit From Your Team"
                  onClick={() => {
                    setShowTeamModal(true)
                  }}
                />
              }
            </span>
            <div className="integration__wrapper">
              {
                userTeamData._teamMembers.map(member => {
                  return <div className="integration" key={member.id} id={member.id}>
                    <img src={management} alt="" className="small" /> {member.name === userData._name ? "You" : member.name}
                    <span className="role">{member.role.toUpperCase()}</span>
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
