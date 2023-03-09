import React, { useEffect, useState } from 'react'
import './directory.scss'
import { addLead, email, funnel, message, pending, refresh, search, deleteIcon, bell, trash } from '../../assets';
import Loader from '../Loader/Loader';
import ChatModal from '../ChatModal/ChatModal';
import Footer from '../Footer/Footer';
import DirectoryModal from '../DirectoryModal/DirectoryModal';


const Directory = ({ socket, permission }) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedSheet, setSelectedSheet] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [showDirectoryModal, setShowDirectoryModal] = useState(false)
    const indexes = [
        0, 2, 3, 5, 6, 7
    ]
    const userAuthToken = JSON.parse(window.localStorage.getItem(
        `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
    ));
    const [userData, setUserData] = useState({
        chatName: "",
        chatNumber: "",
        chatFunnel: "",
        chatParent: "",
        chatEmail: "",
        chatCampaign: "",
        chatBusiness: "",
        chatObjective: "",
        chatPlatform: "",
        chatLabel: "",
        chatHandler: "",
        chatMessages: []
    })

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
        _directories: [],
        _funnels: [],
        _ownChats: [],
        _assignedChats: []
    });

    const [directoryData, setDirectoryData] = useState({
        _id: "",
        _directoryName: "",
        _directoryParent: "",
        _directoryChats: []
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
        socket.emit("get_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
            if (err) {
                myFunction(err)
            }
        })
    }, [])

    useEffect(() => {
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

        socket.on("user_updated", ({ updatedUser, password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                console.log('User Updated')
                setClientData({
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

        socket.on("directory_added", ({ newDirectory, password, Data }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setShowDirectoryModal(false)
                setSelectedSheet(newDirectory._directoryName)
                setDirectoryData({
                    _directoryName: newDirectory._directoryName,
                    _directoryParent: newDirectory._directoryParent,
                    _directoryChats: Data,
                    _id: newDirectory._id
                })
                var input = document.getElementById(newDirectory._directoryName)
                input.checked = "true";
                myFunction('Directory created successfully...')
            }
        })

        socket.on("got_directory", ({ existingdirectory, password, data }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setShowDirectoryModal(false)
                setSelectedSheet(existingdirectory._directoryName)
                setDirectoryData({
                    _directoryName: existingdirectory._directoryName,
                    _directoryParent: existingdirectory._directoryParent,
                    _directoryChats: data,
                    _id: existingdirectory._id
                })
                var input = document.getElementById(existingdirectory._directoryName)
                input.checked = "true";
            }
        })

        socket.on("directory_updated", ({ existingdirectory, password, data }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setShowDirectoryModal(false)
                setSelectedSheet(existingdirectory._directoryName)
                setDirectoryData({
                    _directoryName: existingdirectory._directoryName,
                    _directoryParent: existingdirectory._directoryParent,
                    _directoryChats: data,
                    _id: existingdirectory._id
                })
                var input = document.getElementById(existingdirectory._directoryName)
                input.checked = "true";
            }
        })

        socket.on("directory_deleted", ({ password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setShowDirectoryModal(false)
                setLoader(false)
                setSelectedSheet("")
                setDirectoryData({
                    _directoryName: "",
                    _directoryParent: "",
                    _directoryChats: [],
                    _id: ""
                })
                var input = document.getElementById("close sheets")
                input.checked = "true";
            }
        })

        socket.on("chat_deleted_from_dir", ({ password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
                if (userId === chatDetails._id) {
                    setShowModal(false)
                }
            }
        })
    })

    const searchSheets = (e) => {
        e.preventDefault();
        console.log("Wassup", searchValue);
    };

    const getDirectoryData = (directoryId, directoryName) => {
        setLoader(true)
        setSelectedSheet(directoryName)
        socket.emit("get_directory", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, directoryId }, (err) => {
            if (err) {
                setLoader(false)
                myFunction(err)
            }
        })
    }

    const getDirectoryDataNull = (directoryId) => {
        console.log(directoryId)
        socket.emit("get_directory", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, directoryId }, (err) => {
            if (err) {
                setLoader(false)
                myFunction(err)
            }
        })
    }

    const getUserDetails = async (chatNumber, chatName, chatPlatform, chatEmail, chatCampaign, chatBusiness, chatObjective) => {
        window.localStorage.setItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN, chatNumber)
        socket.emit("get_chat_details", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber }, (err) => {
            if (err === 'Chat not found...') {
                setUserData({
                    chatName: chatName,
                    chatNumber: chatNumber,
                    chatFunnel: "None",
                    chatEmail,
                    chatCampaign,
                    chatBusiness,
                    chatObjective,
                    chatPlatform,
                    chatLabel: 'Neutral',
                    chatMessages: []
                })
                setShowModal(true)
                window.localStorage.setItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN, 'Un-Authenticated')
            } else if (err) {
                myFunction(err)
            }
        })
    }

    const deleteDir = (directoryId) => {
        if (directoryId) {
            setLoader(false)
            socket.emit("delete_directory", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, directoryId }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please provide the directory id...')
        }
    }

    socket.on("got_chat_details", ({ password, chat }) => {
        if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
            const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN);
            if (userId === chat._id || userId === chat._chatNumber) {
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
                window.localStorage.setItem(import.meta.env.VITE_APP_USER_DIRECTORY_SESSION_DATA_TOKEN, chat._id)
                setShowModal(true)
            }
        }
    })

    const checkIndex = (index) => {
        for (let i = 0; i < indexes.length; i++) {
            const element = indexes[i];
            if (index === element) {
                return true;
            }
        }

        return false;
    }

    const capitalize = (text) => {
        const small = text.toLowerCase()
        const extra = small.substring(1, small.length);
        return `${small.substring(0, 1).toUpperCase()}${extra}`
    }

    const limitWords = (word) => {
        if (word.length > 15) {
            return `${word.substring(0, 15)}...`
        } else {
            return word
        }
    }

    return (
        <>
            {
                showModal ? <ChatModal selectedSheet={selectedSheet} socket={socket} showModal={showModal} setShowModal={setShowModal} permission userData={userData} setUserData={setUserData} directoryData={directoryData} getDirectoryData={getDirectoryDataNull} /> : null
            }

            {
                showDirectoryModal ? <DirectoryModal showModal={showDirectoryModal} setShowModal={setShowDirectoryModal} permission={permission} socket={socket} /> : null
            }

            <div className='app__directory'>
                <div id="snackbar">
                    <img src={bell} alt="" />
                    <span id="messagebox">Hello</span>
                </div>
                <div className="app__directory__header">
                    <div className="list-choice">
                        <div className="list-choice-title">Select Sheet</div>
                        <div className="list-choice-objects">
                            {clientData._directories.map((directory) => {
                                return (
                                    <label key={directory.directoryName}>
                                        <input type="radio" name="funnels" id={directory.directoryName} onClick={() => {
                                            getDirectoryData(directory.directoryId, directory.directoryName)
                                        }} />{" "}
                                        <span>
                                            {directory.directoryName}
                                            <div className="color"></div>
                                        </span>
                                    </label>
                                );
                            })}
                            <label >
                                <input type="radio" name="funnels" id='close sheets' onClick={() => {
                                    setData([])
                                }} />{" "}
                                <span>
                                    Close Sheets
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
                            placeholder="Search in sheets....."
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                        />
                        <button
                            type="submit"
                            className="search__button"
                            onClick={searchSheets}
                        >
                            Search
                        </button>
                    </form>
                    <div className="more__actions__wrapper">
                        <img src={addLead} alt="" className="action__icon" onClick={() => {
                            setShowDirectoryModal(true)
                        }} />
                        <img src={trash} alt="" className="action__icon" onClick={() => {
                            deleteDir(directoryData._id)
                        }} />
                    </div>
                </div>
                <div className="app__directory__data">
                    {
                        directoryData._directoryChats.length > 0 ? <div className='app__directory__data m0'>              <div className="app__directory__data__header">
                            {directoryData._directoryChats[0].data.map((header, index) => {
                                if (checkIndex(index)) {
                                    return (
                                        <div className={`app__directory__data__header__labels ${index === 0 ? "br-5" : index === data.length - 1 ? "bl-5" : ""}`} id={header._id} key={header._id}>
                                            <span>
                                                {capitalize(header.field)}
                                            </span>
                                            <div className="line"></div>
                                        </div>
                                    )
                                }
                            })}
                            <div className={`app__directory__data__header__labels bl-5`} id='actions'>
                                <span>
                                    Actions
                                </span>
                                <div className="line"></div>
                            </div>
                        </div>
                            <div className="app__directory__data__body">
                                {directoryData._directoryChats.map((header, index) => {
                                    if (index !== 0) {
                                        return (
                                            <div className="app__directory__rows" key={index}>
                                                <div className="tooltip br-5">
                                                    <span className="tooltiptext">{header.data[0].field}</span>
                                                    <div className={`watermark ${header.data[1].field === "ig" ? "ig" : header.data[1].field === "fb" ? "fb" : header.data[1].field === "wp" ? "wp" : "nm"}`}></div>
                                                    <span className='data'>{limitWords(header.data[0].field)}</span>
                                                </div>
                                                <div className="tooltip">
                                                    <span className="tooltiptext">{header.data[2].field}</span>
                                                    <span className='data'>{limitWords(header.data[2].field)}</span>
                                                </div>
                                                <div className="tooltip">
                                                    <span className="tooltiptext">{header.data[3].field}</span>
                                                    <span className='data'>{limitWords(header.data[3].field)}</span>
                                                </div>
                                                <div className="tooltip">
                                                    <span className="tooltiptext">{header.data[5].field}</span>
                                                    <span className='data'>{limitWords(header.data[5].field)}</span>
                                                </div>
                                                <div className="tooltip">
                                                    <span className="tooltiptext">{header.data[6].field}</span>
                                                    <span className='data'>{limitWords(header.data[6].field)}</span>
                                                </div>
                                                <div className="tooltip">
                                                    <span className="tooltiptext">{header.data[7].field.replace(/_/g, ' ')}</span>
                                                    <span className='data'>{limitWords(header.data[7].field).replace(/_/g, ' ')}</span>
                                                </div>
                                                <div className="actions bl-5" id={header.data[4].field}>
                                                    <img src={message} alt="" className='first' title='Send message to lead...' onClick={() => {
                                                        if (permission) {
                                                            getUserDetails(`${header.data[4].field}@c.us`, header.data[2].field, header.data[1].field, header.data[3].field, header.data[5].field, header.data[6].field, header.data[7].field.replace(/_/g, ' '))
                                                        } else {
                                                            myFunction("Please integrate whatsapp to chat...")
                                                        }
                                                    }} />
                                                    {/* <a href={`mailto:${header.data[3].field}`}> */}
                                                        <img src={email} alt="" className='second' title='Send mail to lead...' />
                                                    {/* </a> */}
                                                    <img src={header.data[header.data.length - 1].field === 'auth' ? deleteIcon : pending} alt="" className='third' title='Delete lead from the sheet...' />
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                                <div className="app__directory__rows">
                                    <div className="tooltip br-5">
                                        <span className='data' id='icon_data'> <img src={addLead} alt="" className='icon' /> Add new field</span>
                                    </div>
                                </div>
                            </div> </div> : loader ? <div className="info__div"> <Loader /> </div> : <div className="info__div"> <span>Select a sheet from the above sheet menu to see its data</span></div>
                    }
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Directory
