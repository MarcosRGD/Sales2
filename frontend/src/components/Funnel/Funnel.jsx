import React, { useEffect, useState } from "react";
import "./funnel.scss";
import {
  addLead,
  createStage,
  funnel,
  inbox,
  leftArrow,
  search,
  timeline,
  profile,
  setting,
  urgent,
  neutral,
  stuck,
  important,
  cancelled,
  done,
  slope,
  forward,
  bell,
  trash
} from "../../assets";
import { ChatModal, Footer } from "../index";
import FunnelModal from "../FunnelModal/FunnelModal";
import FunnelChatModal from "../FunnelChatModal/FunnelChatModal";

const Funnel = ({ socket, permission }) => {
  const [searchValue, setSearchValue] = useState("");
  const [showFunnelModal, setShowFunnelModal] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stageId, setStageId] = useState("");
  const [funnelId, setFunnelId] = useState("");
  const userAuthToken = JSON.parse(window.localStorage.getItem(
    `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
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
    _ownChats: [],
    _directories: [],
    _assignedChats: []
  });
  const [funnelData, setFunnelData] = useState({
    _funnelName: "",
    _funnelStages: [],
    _id: ""
  })
  const [chatData, setChatData] = useState({
    chatName: "",
    chatNumber: "",
    chatFunnel: "",
    chatLabel: "",
    chatMessages: [],
    chatId: "",
    chatParent: "",
    chatEmail: "",
    chatCampaign: "",
    chatBusiness: "",
    chatObjective: "",
    chatPlatform: "",
    chatHandler: ""
  })

  const searchFunnel = (e) => {
    e.preventDefault();
    console.log("Wassup", searchValue);
  };

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
    socket.emit("get_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
  }, [])

  useEffect(() => {
    socket.on("got_user", ({ user, password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
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
          _directories: user._directories,
          _ownChats: user._ownChats,
          _assignedChats: user._assignedChats
        })
      }
    })

    socket.on("user_updated", ({ updatedUser, password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
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
          _directories: updatedUser._directories,
          _ownChats: updatedUser._ownChats,
          _assignedChats: updatedUser._assignedChats
        })
      }
    })

    socket.on("funnel_created", ({ password, newFunnel }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction('Funnel Created Succesfully...')
      }
    })

    socket.on("got_funnel_details", ({ password, funnel }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setFunnelData({
          _funnelName: funnel._funnelName,
          _funnelStages: funnel._funnelStages,
          _id: funnel._id
        })
        setShowFunnel(true)
        setFunnelId(funnel._id)
      }
    })

    socket.on("got_chat_details", ({ password, chat }) => {
      console.log('funnel stream')
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setChatData({
          chatName: chat._chatName,
          chatNumber: chat._chatNumber,
          chatFunnel: chat._chatFunnel,
          chatLabel: chat._chatLabel,
          chatMessages: chat._chatMessages,
          chatId: chat._id,
          chatParent: chat._chatParent,
          chatEmail: chat._chatEmail,
          chatCampaign: chat._chatCampaign,
          chatBusiness: chat._chatBusiness,
          chatObjective: chat._chatObjective,
          chatPlatform: chat._chatPlatform,
          chatHandler: chat._chatHandler,
        })
        window.localStorage.setItem(import.meta.env.VITE_APP_USER_FUNNEL_SESSION_DATA_TOKEN, chat._id)
        setShowModal(true)
      }
    })

    socket.on("funnel_deleted", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction('Funnel Deleted...')
        setFunnelData({
          _funnelName: "",
          _funnelStages: [],
          _id: ""
        })
        setShowFunnel(false)
      }
    })

    socket.on("stage_deleted", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction('Stage Deleted...')
      }
    })

    socket.on("chat_deleted", ({ password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        myFunction('Chat Deleted...')
      }
      setShowModal(false)
    })
  }, [])

  useEffect(() => {
    const draggables = document.querySelectorAll(".chat");
    const containers = document.querySelectorAll(".funnel__chat__wrapper");

    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
    });

    containers.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      });
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [
        ...container.querySelectorAll(".chat:not(.dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }
  }, [showFunnel]);

  const getChatDetails = async (chatNumber, stageId) => {
    socket.emit("get_chat_details", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
    setStageId(stageId)
  }

  const updateChatFunnel = async (funnelId, chatId) => {
    socket.emit("update_chat_funnel", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelId, chatId }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
  }

  const addStage = async (funnelId) => {
    const stageName = prompt('Enter the stage name?')
    socket.emit("add_stage", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelId, stageName }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
  }

  const deleteFunnel = (funnelId) => {
    if (funnelId) {
      socket.emit("delete_funnel", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelId }, (err) => {
        if (err) {
          myFunction(err)
        }
      })
    } else {
      myFunction('Please select a funnel...')
    }
  }

  const deleteStage = (funnelId, stageId) => {
    if (stageId) {
      socket.emit("delete_stage", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelId, stageId }, (err) => {
        if (err) {
          myFunction(err)
        }
      })
    } else {
      myFunction('Please select a stage...')
    }
  }

  return (
    <>
      <FunnelChatModal stageId={stageId} funnelId={funnelId} socket={socket} showModal={showModal} setShowModal={setShowModal} permission={permission} userData={chatData} setUserData={setChatData} />
      <FunnelModal showModal={showFunnelModal} setShowModal={setShowFunnelModal} permission={permission} socket={socket} />
      <div className="app__funnels">
        <div id="snackbar">
          <img src={bell} alt="" />
          <span id="messagebox">Hello</span>
        </div>
        <div className="app__funnels__search__wrapper">
          <div className="list-choice">
            <div className="list-choice-title">Select Funnel</div>
            <div className="list-choice-objects">
              {userData._funnels.map((funnel) => {
                return (
                  <label key={funnel.funnelId}>
                    <input type="radio" name="funnels" id={`${funnel.funnelId}1234`} onClick={() => {
                      socket.emit("get_funnel_details", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelId: funnel.funnelId }, (err) => {
                        if (err) {
                          myFunction(err)
                        }
                      })
                    }} />{" "}
                    <span>
                      {funnel.funnelName}
                      <div className="color"></div>
                    </span>
                  </label>
                );
              })}
              <label >
                <input type="radio" name="funnels" id='close sheets' onClick={() => {
                  setShowFunnel(false)
                  setFunnelData({
                    _funnelName: "",
                    _funnelStages: [],
                    _id: ""
                  })
                }} />{" "}
                <span>
                  Close Funnels
                  <div className="color"></div>
                </span>
              </label>
            </div>
          </div>
          <form className="search__wrapper">
            <img src={search} alt="" className="search__icon" />
            <input
              type="search"
              name=""
              id="search__box"
              placeholder="Search in funnel....."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
            <button
              type="submit"
              className="search__button"
              onClick={searchFunnel}
            >
              Search
            </button>
          </form>
          <div className="more__actions__wrapper">
            {/* <img src={funnel} alt="" className="action__icon" /> */}
            <img src={addLead} alt="" className="action__icon" onClick={() => {
              setShowFunnelModal(true)
            }} />
            <img src={trash} alt="" onClick={() => {
              deleteFunnel(funnelData._id)
            }} className="action__icon" />
          </div>
        </div>

        <div className="app__funnels__wrapper">
          {
            showFunnel ? <>
              {
                funnelData._funnelStages.map((stage) => {
                  return (
                    <div className="funnel">
                      <div className="funnel__header">
                        <img src={inbox} alt="" className="header__icon" />
                        <span>{stage._stageName}</span>
                        <img src={`${stage._stageName === 'Inbox' ? "" : trash}`} onClick={() => {
                          deleteStage(funnelData._id, stage._id)
                        }} alt="" className="header__icon p-absolute" />
                      </div>
                      <div className="funnel__chat__wrapper">
                        {
                          stage._stageChats.map((chat) => {
                            return (
                              <div
                                className="chat"
                                draggable="true"

                                id={chat.chatId}
                              >
                                <img src={profile} alt="" className="chat__icon" />
                                <div className="lead__details" onClick={() => {
                                  getChatDetails(chat.chatNumber, stage._id)
                                }}>
                                  <span className="leadname">{`${chat.chatName.substring(0, 18)}...`}</span>
                                </div>
                                <img src={forward} alt="" className="label__icon" onClick={() => {
                                  updateChatFunnel(funnelData._id, chat.chatId)
                                }} />
                              </div>
                            )
                          })
                        }
                        <div className="chat instruction">
                          Drag & Drop Leads Above This Box To Add Leads To Inbox Stage!
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              <div className="funnel">
                <div className="create__stage">
                  <span>Add a new stage</span>
                  <img src={addLead} className="add__stage" alt="" onClick={() => {
                    addStage(funnelData._id)
                  }} />
                </div>
              </div>
            </> : <div className="app__funnels__directory">
              <div className="info__div">
                <span>Select a category from the above category menu to see its data</span>
              </div>
            </div>
          }
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Funnel;
