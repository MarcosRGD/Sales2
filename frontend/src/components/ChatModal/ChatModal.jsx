import React, { useEffect, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import NoteModal from '../NoteModal/NoteModal';

import {
  attachment,
  notes,
  ai,
  profile,
  smiling,
  trash,
} from "../../assets";

import "./chatmodal.scss";

const ChatModal = ({ directoryData, showModal, setShowModal, userData, setUserData, permission, socket, getDirectoryData, selectedSheet }) => {
  const { showEmoji, setShowEmoji, ref } = useOutsideClick(false)
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [message, setMessage] = useState("")
  const [clientData, setClientData] = useState({
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
    _directories: [],
    _ownChats: [],
    _assignedChats: []
  });

  const userAuthToken = JSON.parse(window.localStorage.getItem(
    `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
  ));
  const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN)

  setTimeout(() => {
    const elem = document.getElementById("chatbox");
    elem.scrollTop = elem.scrollHeight;
  }, 50)

  function myFunction(message) {
    var x = document.getElementById("snackbar");
    x.className.replace("show", "")
    x.className = "show";
    x.innerText = message;

    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  const handleEmojiShow = () => {
    setShowEmoji((v) => !v)
  }

  const handleEmojiSelect = (e) => {
    setMessage((message) => (message += e.native))
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    var modal = document.getElementById("myModal");
    if (showModal) {
      modal.style.display = "flex";
    } else {
      modal.style.display = "none";
    }

    permission ? null : setShowModal(false);
  }, [showModal, permission]);

  useEffect(() => {
    socket.emit("get_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
  }, [])

  useEffect(() => {

    const scrollChatBox = () => {
      console.log("Performed")
      const elem = document.getElementById("chatbox");
      elem.scrollTop = elem.scrollHeight;
    }

    socket.on("got_user", ({ user, password }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setClientData({
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

    socket.on("got_chat_details", ({ password, chat }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
        if (userId === chat._id) {
          setUserData({
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
        }
      }
    })

    socket.on("got_chat_details_for_member", ({ password, chat, target }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        if (target === clientData._id) {
          const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
          if (userId === chat._id) {
            setUserData({
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
          }
        }
      }
    })

    socket.on("whatsapp_message", ({ password, chat }) => {
      console.log('Got')
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
        console.log(userId)
        console.log(chat._id)
        if (userId === chat._id) {
          setUserData({
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
          setTimeout(scrollChatBox, 50)
          getDirectoryData(directoryData._id, directoryData._directoryName)
        }
      }
    })

    socket.on("whatsapp_message_for_member", ({ password, chat, target }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        if (target === clientData._id) {
          const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
          if (userId === chat._id) {
            setUserData({
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
            setTimeout(scrollChatBox, 50)
            getDirectoryData(directoryData._id, directoryData._directoryName)
          }
        }
      }
    })

    socket.on("sent_message", ({ password, chat }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
        if (userId === chat._id) {
          setUserData({
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
          setTimeout(scrollChatBox, 50)
          getDirectoryData(directoryData._id, directoryData._directoryName)
        }
      }
    })

    socket.on("sent_message_for_member", ({ password, chat, target }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
        if (target === clientData._id) {
          if (userId === chat._id) {
            setUserData({
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
            setTimeout(scrollChatBox, 50)
            getDirectoryData(directoryData._id, directoryData._directoryName)
          }
        }
      }
    })
  }, [])


  window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
      setShowModal(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault()
    if (document.getElementById("message").value === "") {
      myFunction('Please type a message...')
    } else {
      socket.emit("send_message", { chatDirectory: selectedSheet, authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${userData.chatNumber}`, clientName: `${userData.chatName}`, permission, message: document.getElementById("message").value, clientEmail: `${userData.chatEmail}`, clientBusiness: `${userData.chatBusiness}`, clientCampaign: userData.chatCampaign, clientObjective: userData.chatObjective, clientPlatform: userData.chatPlatform }, (err) => {
        if (err) {
          myFunction(err)
        }
      })
      var x = document.getElementById("message")
      setMessage("")
      x.value = "";
    }
  }

  const sendAiMessage = () => {
    const template = `A very special greeting from IDEALIDAD Digital Marketing Agency.
    
I am ${clientData._name}and I am here to advise you on everything related to the digital world, tell us ${userData.chatName}, how can we help you?`

    socket.emit("send_message", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${userData.chatNumber}`, clientName: `${userData.chatName}`, permission, message: template }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
  }

  const sendImage = (message) => {
    socket.emit("send_message", { isImage: true, authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${userData.chatNumber}`, clientName: `${userData.chatName}`, permission, message: message }, (err) => {
      if (err) {
        myFunction(err)
      }
    })
    var x = document.getElementById("message")
    x.value = "";
  }

  const getbase64 = (file) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      var message = document.getElementById('message')
      message.value = reader.result
      sendImage(reader.result)
    }
  }

  const onFileChange = (e) => {
    console.log("Called")
    const files = e.target.files;
    const file = files[0]
    getbase64(file)
  }

  const showInput = () => {
    var input = document.getElementById('attachmentSelector')
    input.click()
  }

  const deleteChatFromDatabase = () => {
    if (directoryData._id && userData.chatNumber) {
      socket.emit("delete_chat_from_dir", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, directoryId: directoryData._id, chatNumber: userData.chatNumber }, (err) => {
        if (err) {
          myFunction(err)
        }
      })
    }
  }

  return (
    <div id="myModal" className="modal">
      <NoteModal chatDetails={userData} showModal={showNoteModal} setShowModal={setShowNoteModal} socket={socket} permission={permission} />
      <div className="modal-content">
        <div className="topbar">
          <div className="close" onClick={() => {
            setShowModal(false);
          }}>
            <span>
              &times;
            </span>
          </div>
          <img src={profile} alt="" />
          <div className="lead__details">
            <p className="name">{userData.chatName}</p>
            <p className="number">{userData.chatNumber.substring(0, userData.chatNumber.indexOf("@"))}</p>
          </div>
        </div>
        <div className="chatbox" id="chatbox">
          {
            userData.chatMessages.map((chat, index) => {
              if (chat.type === 'image') {
                return (
                  <div className={`message ${chat.from === "client" ? "client" : "seller"}`} key={index}>
                    <img src={`data:${chat.mimetype};base64,${chat.data}`} alt="" onClick={() => {
                      const linkSource = `data:${chat.mimetype};base64,${chat.data}`;
                      const downloadLink = document.createElement("a");
                      downloadLink.href = linkSource;
                      downloadLink.download = 'Idealidad-Image';
                      downloadLink.click();
                    }} />
                    <div className="timestamps">
                      <i className='user'>{chat.caption.length > 0 ? chat.caption.substring(chat.caption.substring(" ")) : 'Lead'} |&nbsp;</i>
                      <i className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</i>
                      <i className='date'>{chat.timestamp.substring(16, 25)}</i>
                    </div>
                  </div>
                )
              } else if (chat.type === 'note') {
                return (
                  <div className={`note ${chat.from === "client" ? "client" : "seller"}`} key={index}>
                    <i className='dataFor'>{chat.data}</i>
                    <div className="timestamps">
                      <i className='user'>{chat.caption.substring(chat.caption.substring(" "))} |&nbsp;</i>
                      <i className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</i>
                      <i className='date'>{chat.timestamp.substring(16, 25)}</i>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className={`message ${chat.from === "client" ? "client" : "seller"}`} key={index}>
                    <p>{chat.data}</p>
                    <div className="timestamps">
                      <i className='user'>{chat.caption.length > 0 ? chat.caption.substring(chat.caption.substring(" ")) : 'Lead'} |&nbsp;</i>
                      <i className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</i>
                      <i className='date'>{chat.timestamp.substring(16, 25)}</i>
                    </div>
                  </div>
                )
              }
            })
          }
        </div>
        <div className="messagebox">
          <img src={notes} alt="" onClick={() => {
            setShowNoteModal(true)
          }} />
          <img src={smiling} alt="" onClick={handleEmojiShow} />
          <img src={attachment} alt="" onClick={showInput} />
          <input onChange={onFileChange} type="file" name="" id="attachmentSelector" accept="image/png, image/gif, image/jpeg" />
          <img src={ai} alt="" onClick={sendAiMessage} />
          <img src={trash} onClick={deleteChatFromDatabase} alt="" />
          <form className="send__message__wrapper">
            <input type="text" value={message} onChange={handleMessageChange} placeholder="Type a message...." id="message" />
            <button type="submit" onClick={sendMessage}>Send message</button>
          </form>
          {
            showEmoji && (
              <div className='emoji__picker' ref={ref}>
                <Picker
                  onEmojiSelect={handleEmojiSelect}
                  data={data}
                />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
