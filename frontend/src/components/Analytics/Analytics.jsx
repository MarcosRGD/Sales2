import React, { useState, useEffect } from 'react'
import useOutsideClick from "../../hooks/useOutsideClick";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import './analytics.scss'
import {
    attachment,
    notes,
    smiling,
    trash,
    bell,
    construction,
} from "../../assets";

const Analytics = ({ socket }) => {
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
        _chatBot: false,
        _chatBotTemplate: [],
        _totalMessagesSentThisWeek: [],
        _totalLeadsGainedThisWeek: [],
        _funnelsCount: 0,
        _funnels: [],
        _teamChats: [],
        _ownChats: [],
        _assignedChats: []
    });
    const { showEmoji, setShowEmoji, ref } = useOutsideClick(false)
    const [message, setMessage] = useState("")
    const [chatBot, setChatBot] = useState(false)

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
                setChatBot(user._chatBot)
                setUserData({
                    _id: user._id,
                    _name: user._name,
                    _email: user._email,
                    _teamId: user._teamId,
                    _teamRole: user._teamRole,
                    _chatBot: user._chatBot,
                    _chatBotTemplate: user._chatBotTemplate,
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
            }
        })

        socket.on("user_updated", ({ updatedUser, password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setChatBot(updatedUser._chatBot)
                setUserData({
                    _id: updatedUser._id,
                    _name: updatedUser._name,
                    _email: updatedUser._email,
                    _teamId: updatedUser._teamId,
                    _teamRole: updatedUser._teamRole,
                    _chatBot: updatedUser._chatBot,
                    _chatBotTemplate: updatedUser._chatBotTemplate,
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
            }
        })
    })

    const handleEmojiShow = () => {
        setShowEmoji((v) => !v)
    }

    const handleEmojiSelect = (e) => {
        setMessage((message) => (message += e.native))
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    const sendTemplate = (e) => {
        e.preventDefault()
        const template = document.getElementById('message').value

        if (template.length !== 0) {
            const userUpdates = {
                _chatBotTemplate: [...userData._chatBotTemplate, {
                    type: 'chat',
                    mimetype: 'chat',
                    data: template,
                    from: userData._name
                }]
            }
            socket.emit("update_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, userUpdates }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please type a message...')
        }
        setMessage("")

    }

    const sendImage = (message) => {
        const userUpdates = {
            _chatBotTemplate: [...userData._chatBotTemplate, {
                type: 'image',
                mimetype: message.substring(message.indexOf(':') + 1, message.indexOf(';')),
                data: message.substring(message.indexOf(',') + 1),
                from: userData._name
            }]
        }
        socket.emit("update_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, userUpdates }, (err) => {
            if (err) {
                myFunction(err)
            }
        })
    }

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

    const getbase64 = (file) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
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

    const deleteTemplateChat = (id) => {
        var templateDetails;
        var ownTemplates = userData._chatBotTemplate
        for (let index = 0; index < ownTemplates.length; index++) {
            const element = ownTemplates[index];
            var templateId = JSON.stringify(element._id)
            if (JSON.stringify(id) === templateId) {
                templateDetails = ownTemplates.splice(index, 1)
                break;
            }
        }
        const userUpdates = {
            _chatBotTemplate: [...ownTemplates]
        }
        socket.emit("update_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, userUpdates }, (err) => {
            if (err) {
                myFunction(err)
            }
        })
    }

    const activateChatBot = () => {
        if (userData._chatBotTemplate.length === 0) {
            myFunction('Please add some messages...')
        } else {
            if (chatBot) {
                const userUpdates = {
                    _chatBot: false
                }
                socket.emit("update_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, userUpdates }, (err) => {
                    if (err) {
                        myFunction(err)
                    }
                })
            } else if (!chatBot) {
                const userUpdates = {
                    _chatBot: true
                }
                socket.emit("update_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, userUpdates }, (err) => {
                    if (err) {
                        myFunction(err)
                    }
                })
            }
        }
    }

    return (
        <div className='app__salesbot'>
            <div id="snackbar">
                <img src={bell} alt="" />
                <span id="messagebox">Hello</span>
            </div>
            <div className="message" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <img src={construction} alt="" srcset="" style={{ width: '60px' }} />
                <span style={{ width: '60%', textAlign: 'center', marginTop: '20px' }}>Sorry for the inconvience. But the analytics menu will be launched with super admin as it has a registory at super admin dashboard. You can have a look at its trial version at the dashboard. Thanks for your co-operation.</span>
            </div>
            {/* <div className="top__sales__container">
                <span className='content'>
                    Idealidad Saleshub Welcome Message Bot Feature
                </span>
                <label class="switch">
                    <input type="checkbox" checked={chatBot} onChange={activateChatBot} />
                    <span class="slider round"></span>
                </label>
            </div> */}
            {/* <div className="template__container">
                <div className="chatbox">
                    {
                        userData._chatBotTemplate.map((chat, index) => {
                            if (chat.type === 'image') {
                                return (
                                    <div className={`message seller`} key={index}>
                                        <span className='delIcon' onClick={() => {
                                            deleteTemplateChat(chat._id)
                                        }}>❌</span>
                                        <img className='text' src={`data:${chat.mimetype};base64,${chat.data}`} alt="" onClick={() => {
                                            const linkSource = `data:${chat.mimetype};base64,${chat.data}`;
                                            const downloadLink = document.createElement("a");
                                            downloadLink.href = linkSource;
                                            downloadLink.download = 'Idealidad-Image';
                                            downloadLink.click();
                                        }} />
                                        <div className="timestamps">
                                            <span className='user'>{chat.from} |&nbsp;</span>
                                            <span className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</span>
                                            <span className='date'>{chat.timestamp.substring(16, 25)}</span>
                                        </div>
                                    </div>
                                )
                            } else if (chat.type === 'note') {
                                return (
                                    <div className={`note seller`} key={index}>
                                        <i className='dataFor'>{chat.data}</i>
                                        <div className="timestamps">
                                            <span className='user'>{chat.from} |&nbsp;</span>
                                            <span className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</span>
                                            <span className='date'>{chat.timestamp.substring(16, 25)}</span>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className={`message seller`} key={index}>
                                        <span className='delIcon' onClick={() => {
                                            deleteTemplateChat(chat._id)
                                        }}>❌</span>
                                        <p>{chat.data}</p>
                                        <div className="timestamps">
                                            <span className='user'>{chat.from} |&nbsp;</span>
                                            <span className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</span>
                                            <span className='date'>{chat.timestamp.substring(16, 25)}</span>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className="template__controllers">
                    <img src={smiling} alt="" onClick={handleEmojiShow} />
                    <img src={attachment} alt="" onClick={showInput} />
                    <input type="file" name="" id="attachmentSelector" accept="image/png, image/gif, image/jpeg" onChange={onFileChange} />
                    <form className="send__message__wrapper">
                        <input type="text" placeholder="Type a message...." id="message" value={message} onChange={handleMessageChange} />
                        <button type="submit" onClick={sendTemplate}>Send message</button>
                    </form>
                    {
                        showEmoji && (
                            <div className='emoji__picker_' ref={ref}>
                                <Picker
                                    onEmojiSelect={handleEmojiSelect}
                                    data={data}
                                />
                            </div>
                        )
                    }
                </div>
            </div> */}
        </div>
    )
}

export default Analytics
