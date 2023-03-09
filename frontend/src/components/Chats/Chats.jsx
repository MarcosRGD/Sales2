import React, { useEffect, useState } from 'react'
import './chats.scss'
import Upscaler from 'upscaler';
const upscaler = new Upscaler();
import useOutsideClick from "../../hooks/useOutsideClick";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import NoteModal from '../NoteModal/NoteModal';
import {
    directory,
    addLead,
    ai,
    bell,
    inbox,
    search,
    profile,
    attachment,
    notes,
    smiling,
    management,
    calendar,
    email,
    campaign,
    business,
    target,
    platform,
    tags,
    urgent,
    neutral,
    stuck,
    important,
    cancelled,
    done,
    slope,
    infoName,
    infoPhone,
    infoFunnel,
    gain,
    trash
} from "../../assets";
import Footer from '../Footer/Footer'
import CreateChatModal from '../CreateChatModal/CreateChatModal';

const Chats = ({ socket, permission }) => {
    const { showEmoji, setShowEmoji, ref } = useOutsideClick(false)
    const [message, setMessage] = useState("")
    const [teamId, setTeamId] = useState("")
    const [searchValue, setSearchValue] = useState("");
    const [sheets, setSheets] = useState([]);
    const [fetchTeam, setFetchTeam] = useState(false);
    const [chats, setChats] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [ownChats, setOwnChats] = useState([])
    const [assignedChats, setAssignedChats] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [displayChat, setDisplayChat] = useState(false)
    const [chatDetails, setChatDetails] = useState({
        id: "",
        chatName: "",
        chatNumber: "",
        chatFunnel: "",
        chatParent: "",
        chatParentTeam: "",
        chatEmail: "",
        chatDirectory: "",
        chatCampaign: "",
        chatBusiness: "",
        chatValue: 0,
        chatObjective: "",
        chatPlatform: "",
        chatLabel: "",
        chatHandlerName: "",
        chatHandlerId: "",
        chatMessages: [],
        chatDate: "",
    })
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
        _directories: [],
        _ownChats: [],
        _assignedChats: []
    });
    const [userTeamData, setUserTeamData] = useState({
        _id: "",
        _teamName: "Your team",
        _teamAdmin: "",
        _gsIntegration: false,
        _gsSessionData: "",
        _fbIntegration: false,
        _fbSessionData: "",
        _igIntegration: false,
        _igSessionData: "",
        _teamMembers: [],
        _teamFunnels: [],
        _totalMessagesSent: 0,
        _totalLeadsGained: 0,
        _totalMessagesSentThisWeek: [],
        _totalLeadsGainedThisWeek: [],
    })
    const [infoNameBox, setInfoNameBox] = useState("")
    const [infoGainBox, setInfoGainBox] = useState(0)
    const [infoEmailBox, setInfoEmailBox] = useState("")
    const [infoCampaignBox, setInfoCampaignBox] = useState("")
    const [infoBusinessBox, setInfoBusinessBox] = useState("")
    const [infoOjectiveBox, setInfoObjectiveBox] = useState("")

    const handleEmojiShow = () => {
        setShowEmoji((v) => !v)
    }

    const handleEmojiSelect = (e) => {
        setMessage((message) => (message += e.native))
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    setTimeout(() => {
        const elem = document.getElementById("chatbox");
        elem.scrollTop = elem.scrollHeight;
    }, 50)

    const chatsItemsNeutral = [
        "WP Leads",
        "CL Leads"
    ]
    const chatsItemsTeam = [
        "WP Leads",
        "FB Leads",
        "IG Leads",
        "CL Leads"
    ]
    const userAuthToken = JSON.parse(window.localStorage.getItem(
        `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
    ));


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

    const getGoogleSheets = () => {
        socket.emit("get_googlesheets", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
            if (err) {
                myFunction(err)
            }
        })
    }

    useEffect(() => {
        socket.emit("get_user", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
            if (err) {
                myFunction(err)
            }
        })

        fetchTeam ? socket.emit("get_user_team", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, teamId }, (err) => {
            if (err) {
                myFunction(err)
            }
        }) : null
    }, [fetchTeam])

    useEffect(() => {

        const scrollChatBox = () => {
            const elem = document.getElementById("chatbox");
            elem.scrollTop = elem.scrollHeight;
        }

        socket.on("got_sheets", ({ password, sheets }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setSheets(sheets)
            }
        })

        socket.on("got_user", ({ user, password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setTeamId(user._teamId)
                setOwnChats(user._wpChats)
                setAssignedChats(user._assignedChats)
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
                    _ownChats: user._wpChats,
                    _assignedChats: user._assignedChats
                })

                if (user._gsIntegration && user._gsSessionData !== "") {
                    getGoogleSheets()
                }

                if (user._teamId !== "" && user._teamRole !== "neutral") {
                    setFetchTeam(true)
                } else {
                    setFetchTeam(false)
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
                    _gsIntegration: team._gsIntegration,
                    _gsSessionData: team._gsSessionData,
                    _fbIntegration: team._fbIntegration,
                    _fbSessionData: team._fbSessionData,
                    _igIntegration: team._igIntegration,
                    _igSessionData: team._igSessionData,
                    _totalMessagesSent: team._totalMessagesSent,
                    _totalLeadsGained: team._totalLeadsGained,
                    _totalMessagesSentThisWeek: JSON.parse(team._totalMessagesSentThisWeek),
                    _totalLeadsGainedThisWeek: JSON.parse(team._totalLeadsGainedThisWeek),
                })
            }
        })

        socket.on("user_updated", ({ updatedUser, password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                setTeamId(updatedUser._teamId)
                setOwnChats(updatedUser._wpChats)
                setAssignedChats(updatedUser._assignedChats)
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
                    _ownChats: updatedUser._wpChats,
                    _assignedChats: updatedUser._assignedChats
                })

                if (updatedUser._gsIntegration && updatedUser._gsSessionData !== "") {
                    getGoogleSheets()
                }

                if (updatedUser._teamId !== "" && updatedUser._teamRole !== "neutral") {
                    setFetchTeam(true)
                } else {
                    setFetchTeam(false)
                }
            }
        })

        socket.on("member_updated", ({ updatedUser, password, target }) => {
            console.log("Third Party Request got")
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                if (target === userData._id) {
                    setTeamId(updatedUser._teamId)
                    setOwnChats(updatedUser._wpChats)
                    setAssignedChats(updatedUser._assignedChats)
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
                        _ownChats: updatedUser._wpChats,
                        _assignedChats: updatedUser._assignedChats
                    })

                    if (updatedUser._gsIntegration && updatedUser._gsSessionData !== "") {
                        getGoogleSheets()
                    }

                    if (updatedUser._teamId !== "" && updatedUser._teamRole !== "neutral") {
                        setFetchTeam(true)
                    } else {
                        setFetchTeam(false)
                    }
                }
            }
        })

        socket.on("got_chat_details", ({ password, chat }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                if (userId === chat._id) {
                    setChatDetails({
                        id: chat._id,
                        chatName: chat._chatName,
                        chatValue: chat._chatValue,
                        chatNumber: chat._chatNumber,
                        chatFunnel: chat._chatFunnel,
                        chatParent: chat._chatParent,
                        chatParentTeam: chat._chatParentTeam,
                        chatDirectory: chat._chatDirectory,
                        chatEmail: chat._chatEmail,
                        chatCampaign: chat._chatCampaign,
                        chatBusiness: chat._chatBusiness,
                        chatObjective: chat._chatObjective,
                        chatPlatform: chat._chatPlatform,
                        chatLabel: chat._chatLabel,
                        chatHandlerName: chat._chatHandlerName,
                        chatHandlerId: chat._chatHandlerId,
                        chatMessages: chat._chatMessages,
                        chatDate: chat._chatDate
                    })
                    setTimeout(scrollChatBox, 50)
                    setDisplayChat(true)
                    setShowModal(false)


                    setInfoNameBox(chat._chatName)
                    setInfoEmailBox(chat._chatEmail)
                    setInfoGainBox(chat._chatValue)
                    setInfoCampaignBox(chat._chatCampaign)
                    setInfoBusinessBox(chat._chatBusiness)
                    setInfoObjectiveBox(chat._chatObjective)
                }
            }
        })

        socket.on("got_chat_details_for_member", ({ password, chat, target }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                if (target === userData._id) {
                    const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                    if (userId === chat._id) {
                        setChatDetails({
                            id: chat._id,
                            chatName: chat._chatName,
                            chatValue: chat._chatValue,
                            chatNumber: chat._chatNumber,
                            chatFunnel: chat._chatFunnel,
                            chatParent: chat._chatParent,
                            chatParentTeam: chat._chatParentTeam,
                            chatDirectory: chat._chatDirectory,
                            chatEmail: chat._chatEmail,
                            chatCampaign: chat._chatCampaign,
                            chatBusiness: chat._chatBusiness,
                            chatObjective: chat._chatObjective,
                            chatPlatform: chat._chatPlatform,
                            chatLabel: chat._chatLabel,
                            chatHandlerName: chat._chatHandlerName,
                            chatHandlerId: chat._chatHandlerId,
                            chatMessages: chat._chatMessages,
                            chatDate: chat._chatDate
                        })
                        setTimeout(scrollChatBox, 50)
                        setDisplayChat(true)
                        setShowModal(false)


                        setInfoNameBox(chat._chatName)
                        setInfoEmailBox(chat._chatEmail)
                        setInfoGainBox(chat._chatValue)
                        setInfoCampaignBox(chat._chatCampaign)
                        setInfoBusinessBox(chat._chatBusiness)
                        setInfoObjectiveBox(chat._chatObjective)
                    }
                }
            }
        })

        socket.on("chat_deleted", ({ password }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                myFunction('Chat Deleted...')
                setChatDetails({
                    id: "",
                    chatName: "",
                    chatNumber: "",
                    chatFunnel: "",
                    chatParent: "",
                    chatParentTeam: "",
                    chatEmail: "",
                    chatDirectory: "",
                    chatCampaign: "",
                    chatBusiness: "",
                    chatValue: 0,
                    chatObjective: "",
                    chatPlatform: "",
                    chatLabel: "",
                    chatHandlerName: "",
                    chatHandlerId: "",
                    chatMessages: [],
                    chatDate: "",
                })
                setDisplayChat(false)

            }
        })

        socket.on("chat_deleted_by_admin", ({ password, target }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                if (chats === 'Assigned chats') {
                    const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                    if (userId === chatDetails._id) {
                        if (target === userData._id) {
                            myFunction('Chat Deleted...')
                            setChatDetails({
                                id: "",
                                chatName: "",
                                chatNumber: "",
                                chatFunnel: "",
                                chatParent: "",
                                chatParentTeam: "",
                                chatEmail: "",
                                chatDirectory: "",
                                chatCampaign: "",
                                chatBusiness: "",
                                chatValue: 0,
                                chatObjective: "",
                                chatPlatform: "",
                                chatLabel: "",
                                chatHandlerName: "",
                                chatHandlerId: "",
                                chatMessages: [],
                                chatDate: "",
                            })
                            setDisplayChat(false)
                        }
                    }
                }
            }
        })

        socket.on("whatsapp_message", ({ password, chat }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                if (userId === chat._id) {
                    setChatDetails({
                        id: chat._id,
                        chatName: chat._chatName,
                        chatNumber: chat._chatNumber,
                        chatDirectory: chat._chatDirectory,
                        chatFunnel: chat._chatFunnel,
                        chatParent: chat._chatParent,
                        chatParentTeam: chat._chatParentTeam,
                        chatEmail: chat._chatEmail,
                        chatCampaign: chat._chatCampaign,
                        chatValue: chat._chatValue,
                        chatBusiness: chat._chatBusiness,
                        chatObjective: chat._chatObjective,
                        chatPlatform: chat._chatPlatform,
                        chatLabel: chat._chatLabel,
                        chatHandlerName: chat._chatHandlerName,
                        chatHandlerId: chat._chatHandlerId,
                        chatMessages: chat._chatMessages,
                        chatDate: chat._chatDate
                    })
                    setTimeout(scrollChatBox, 50)

                    setInfoNameBox(chat._chatName)
                    setInfoGainBox(chat._chatValue)
                    setInfoEmailBox(chat._chatEmail)
                    setInfoCampaignBox(chat._chatCampaign)
                    setInfoBusinessBox(chat._chatBusiness)
                    setInfoObjectiveBox(chat._chatObjective)
                }
            }
        })

        socket.on("whatsapp_message_for_member", ({ password, chat, target }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                console.log("Third party wp message", target)
                if (target === userData._id) {
                    const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                    if (userId === chat._id) {
                        setChatDetails({
                            id: chat._id,
                            chatName: chat._chatName,
                            chatNumber: chat._chatNumber,
                            chatDirectory: chat._chatDirectory,
                            chatFunnel: chat._chatFunnel,
                            chatParent: chat._chatParent,
                            chatParentTeam: chat._chatParentTeam,
                            chatEmail: chat._chatEmail,
                            chatCampaign: chat._chatCampaign,
                            chatValue: chat._chatValue,
                            chatBusiness: chat._chatBusiness,
                            chatObjective: chat._chatObjective,
                            chatPlatform: chat._chatPlatform,
                            chatLabel: chat._chatLabel,
                            chatHandlerName: chat._chatHandlerName,
                            chatHandlerId: chat._chatHandlerId,
                            chatMessages: chat._chatMessages,
                            chatDate: chat._chatDate
                        })
                        setTimeout(scrollChatBox, 50)

                        setInfoNameBox(chat._chatName)
                        setInfoGainBox(chat._chatValue)
                        setInfoEmailBox(chat._chatEmail)
                        setInfoCampaignBox(chat._chatCampaign)
                        setInfoBusinessBox(chat._chatBusiness)
                        setInfoObjectiveBox(chat._chatObjective)
                    }
                }
            }
        })

        socket.on("sent_message", ({ password, chat }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                if (userId === chat._id) {
                    setChatDetails({
                        id: chat._id,
                        chatName: chat._chatName,
                        chatNumber: chat._chatNumber,
                        chatFunnel: chat._chatFunnel,
                        chatValue: chat._chatValue,
                        chatDirectory: chat._chatDirectory,
                        chatParent: chat._chatParent,
                        chatParentTeam: chat._chatParentTeam,
                        chatEmail: chat._chatEmail,
                        chatCampaign: chat._chatCampaign,
                        chatBusiness: chat._chatBusiness,
                        chatObjective: chat._chatObjective,
                        chatPlatform: chat._chatPlatform,
                        chatLabel: chat._chatLabel,
                        chatHandlerName: chat._chatHandlerName,
                        chatHandlerId: chat._chatHandlerId,
                        chatMessages: chat._chatMessages,
                        chatDate: chat._chatDate
                    })
                    setTimeout(scrollChatBox, 50)


                    setInfoNameBox(chat._chatName)
                    setInfoGainBox(chat._chatValue)
                    setInfoEmailBox(chat._chatEmail)
                    setInfoCampaignBox(chat._chatCampaign)
                    setInfoBusinessBox(chat._chatBusiness)
                    setInfoObjectiveBox(chat._chatObjective)
                }
            }
        })

        socket.on("sent_message_for_member", ({ password, chat, target }) => {
            if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
                const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                if (userId === chat._id) {
                    if (target === userData._id) {
                        const userId = window.localStorage.getItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN);
                        if (userId === chat._id) {
                            setChatDetails({
                                id: chat._id,
                                chatName: chat._chatName,
                                chatNumber: chat._chatNumber,
                                chatFunnel: chat._chatFunnel,
                                chatValue: chat._chatValue,
                                chatDirectory: chat._chatDirectory,
                                chatParent: chat._chatParent,
                                chatParentTeam: chat._chatParentTeam,
                                chatEmail: chat._chatEmail,
                                chatCampaign: chat._chatCampaign,
                                chatBusiness: chat._chatBusiness,
                                chatObjective: chat._chatObjective,
                                chatPlatform: chat._chatPlatform,
                                chatLabel: chat._chatLabel,
                                chatHandlerName: chat._chatHandlerName,
                                chatHandlerId: chat._chatHandlerId,
                                chatMessages: chat._chatMessages,
                                chatDate: chat._chatDate
                            })
                            setTimeout(scrollChatBox, 50)


                            setInfoNameBox(chat._chatName)
                            setInfoGainBox(chat._chatValue)
                            setInfoEmailBox(chat._chatEmail)
                            setInfoCampaignBox(chat._chatCampaign)
                            setInfoBusinessBox(chat._chatBusiness)
                            setInfoObjectiveBox(chat._chatObjective)
                        }
                    }
                }
            }
        })
    })

    const assignChat = () => {
        const memberId = document.getElementById("handler").value

        if (memberId !== 'false') {
            socket.emit("assign_chat_to_member", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, memberId, chatId: chatDetails.id }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        }
    }

    const sendMessage = (e) => {
        e.preventDefault()
        if (document.getElementById("message").value === "") {
            myFunction('Please type a message...')
        } else {
            socket.emit("send_message", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${chatDetails.chatNumber}`, clientName: `${chatDetails.chatName}`, permission, message: document.getElementById("message").value }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
            var x = document.getElementById("message")
            x.value = "";
            setMessage("")
        }
    }

    const sendAiMessage = () => {
        const template = `A very special greeting from IDEALIDAD Digital Marketing Agency.
        
I am ${userData._name}and I am here to advise you on everything related to the digital world, tell us ${chatDetails.chatName}, how can we help you?`

        socket.emit("send_message", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${chatDetails.chatNumber}`, clientName: `${chatDetails.chatName}`, permission, message: template }, (err) => {
            if (err) {
                myFunction(err)
            }
        })
    }

    const sendImage = (message) => {
        socket.emit("send_message", { isImage: true, authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${chatDetails.chatNumber}`, clientName: `${chatDetails.chatName}`, permission, message: message }, (err) => {
            if (err) {
                myFunction(err)
            }
        })
        var x = document.getElementById("message")
        x.value = "";
    }

    const updateChatStatus = () => {
        var chatStatus = document.getElementById('status').value;
        const chatUpdates = {
            _chatLabel: chatStatus
        }
        if (chatStatus !== 'false') {
            if (chats === 'Assigned chats') {
                socket.emit("update_chat", { origin: true, authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatUpdates, chatNumber: chatDetails.chatNumber }, (err) => {
                    if (err) {
                        myFunction(err)
                    }
                })
            } else {
                socket.emit("update_chat", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatUpdates, chatNumber: chatDetails.chatNumber }, (err) => {
                    if (err) {
                        myFunction(err)
                    }
                })

            }
        } else {
            myFunction('Please select other label...')
        }
    }

    const updateChatFunnel = () => {
        var chatFunnel = document.getElementById('funnel').value;

        if (chatFunnel !== 'false') {
            socket.emit("add_chat_to_funnel", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelId: chatFunnel, chatId: chatDetails.id }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please select other funnel...')
        }
    }

    const updateChatDirectory = () => {
        var chatFunnel = document.getElementById('directory').value;

        if (chatFunnel !== 'false') {
            socket.emit("add_chat_to_dir", {
                authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, directoryId: chatFunnel, chatDetails: {
                    chatId: chatDetails.id,
                    name: chatDetails.chatName,
                    number: chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@')),
                    campaign: chatDetails.chatCampaign,
                    business: chatDetails.chatBusiness,
                    email: chatDetails.chatEmail,
                    platform: chatDetails.chatPlatform,
                    date: chatDetails.chatDate,
                    objective: chatDetails.chatObjective,
                }
            }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please select other funnel...')
        }
    }

    const upscaleImage = (base64) => {
        upscaler.upscale(base64).then(upscaledImage => {
            return upscaledImage // base64 representation of image src
        })
    }

    const updateChatDetails = () => {
        if (chats === 'Assigned chats') {
            const chatUpdates = {
                _chatValue: parseInt(infoGainBox),
                _chatEmail: infoEmailBox,
                _chatCampaign: infoCampaignBox,
                _chatBusiness: infoBusinessBox,
                _chatObjective: infoOjectiveBox,
            }
            socket.emit("update_chat", { origin: true, authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatUpdates, chatNumber: chatDetails.chatNumber }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            const chatUpdates = {
                _chatName: infoNameBox,
                _chatValue: parseInt(infoGainBox),
                _chatEmail: infoEmailBox,
                _chatCampaign: infoCampaignBox,
                _chatBusiness: infoBusinessBox,
                _chatObjective: infoOjectiveBox,
            }
            socket.emit("update_chat", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatUpdates, chatNumber: chatDetails.chatNumber }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })

        }
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

    const deleteChat = (chatNumber) => {
        if (chats === 'WP Chats') {
            socket.emit("delete_chat", { origin: true, authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            socket.emit("delete_chat", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        }
    }

    const showInput = () => {
        var input = document.getElementById('attachmentSelector')
        input.click()
    }

    const search_word = (text, word) => {

        var x = 0, y = 0;

        for (i = 0; i < text.length; i++) {
            if (text[i] == word[0]) {
                for (j = i; j < i + word.length; j++) {
                    if (text[j] == word[j - i]) {
                        y++
                    }
                    if (y == word.length) {
                        x++
                    }
                }
                y = 0;
            }
        }
        return x
    }

    const showSearchedChats = (searchValue) => {
        if (searchValue === "") {
            setOwnChats(userData._ownChats)
            setAssignedChats(userData._assignedChats)
        } else if (searchValue !== "") {
            if (chats === 'WP Leads') {
                for (let index = 0; index < userData._ownChats.length; index++) {
                    const ownChat = userData._ownChats[index];
                    console.log({ ownChat })

                    const count = search_word(ownChat.chatName, searchValue)
                    console.log(ownChat.chatName)
                    console.log({ count })
                }
            } else if (chat === 'Assigned chats') {
                for (let index = 0; index < userData._assignedChats.length; index++) {
                    const ownChat = userData._assignedChats[index];

                    const count = search_word(ownChat.chatName, searchValue)
                    console.log(ownChat.chatName)
                    console.log({ count })
                }

            }
        }
    }

    console.log({ ownChats })

    return (
        <>
            <CreateChatModal showModal={showModal} setShowModal={setShowModal} socket={socket} permission={permission} />
            <NoteModal chatDetails={chatDetails} showModal={showNoteModal} setShowModal={setShowNoteModal} socket={socket} permission={permission} />
            <div className="app__chats">
                <div id="snackbar">
                    <img src={bell} alt="" />
                    <span id="messagebox">Hello</span>
                </div>

                <div className="app__funnels__search__wrapper">
                    <div className="list-choice">
                        <div className="list-choice-title">Select category</div>
                        <div className="list-choice-objects">
                            {
                                userData._teamRole === 'neutral' ? chatsItemsNeutral.map((chat, index) => {
                                    return (
                                        <label key={chat}>
                                            <input type="radio" name="funnels" id={chat} onClick={() => {
                                                if (chat === 'CL Leads') {
                                                    setShowChat(false)
                                                    setChats("")
                                                    setDisplayChat(false)
                                                    setChatDetails({
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
                                                        chatMessages: [],
                                                        chatDate: ""
                                                    })
                                                } else {
                                                    setChats(chat)
                                                    setShowChat(true)
                                                }
                                            }} />{" "}
                                            <span>
                                                {chat}
                                                <div className="color"></div>
                                            </span>
                                        </label>
                                    );
                                }) : userData._teamRole !== 'neutral' ? chatsItemsTeam.map((chat, index) => {
                                    return (
                                        <label key={chat}>
                                            <input type="radio" name="funnels" id={chat} onClick={() => {
                                                if (chat === 'CL Leads') {
                                                    setShowChat(false)
                                                    setChats("")
                                                    setDisplayChat(false)
                                                    setChatDetails({
                                                        id: "",
                                                        chatName: "",
                                                        chatNumber: "",
                                                        chatFunnel: "",
                                                        chatParent: "",
                                                        chatParentTeam: "",
                                                        chatEmail: "",
                                                        chatDirectory: "",
                                                        chatCampaign: "",
                                                        chatBusiness: "",
                                                        chatValue: 0,
                                                        chatObjective: "",
                                                        chatPlatform: "",
                                                        chatLabel: "",
                                                        chatHandlerName: "",
                                                        chatHandlerId: "",
                                                        chatMessages: [],
                                                        chatDate: "",
                                                    })
                                                } else {
                                                    setChatDetails({
                                                        id: "",
                                                        chatName: "",
                                                        chatNumber: "",
                                                        chatFunnel: "",
                                                        chatParent: "",
                                                        chatParentTeam: "",
                                                        chatEmail: "",
                                                        chatDirectory: "",
                                                        chatCampaign: "",
                                                        chatBusiness: "",
                                                        chatValue: 0,
                                                        chatObjective: "",
                                                        chatPlatform: "",
                                                        chatLabel: "",
                                                        chatHandlerName: "",
                                                        chatHandlerId: "",
                                                        chatMessages: [],
                                                        chatDate: "",
                                                    })
                                                    setChats(chat)
                                                    setShowChat(true)
                                                    setDisplayChat(false)
                                                }
                                            }} />{" "}
                                            <span>
                                                {chat}
                                                <div className="color"></div>
                                            </span>
                                        </label>
                                    );
                                }) : null
                            }
                        </div>
                    </div>
                    <form className="search__wrapper">
                        <img src={search} alt="" className="search__icon" />
                        <input
                            type="search"
                            name=""
                            id="search__box"
                            placeholder="Search for chats....."
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                            onKeyUp={(e) => {
                                const value = e.target.value
                                const searchQuery = value.toLowerCase()
                                if (value.length > 0) {
                                    if (chats === 'WP Leads') {
                                        const ownChats = userData._ownChats

                                        var searchedValues = []
                                        for (const chat of ownChats) {
                                            let chatName = chat.chatName.toLowerCase()

                                            if (chatName.includes(searchQuery)) {
                                                searchedValues.push(chat)
                                                setOwnChats(searchedValues)
                                            }
                                        }
                                    } else if (chats === 'Assigned chats') {
                                        const assignedChats = userData._assignedChats

                                        var searchedValues = []
                                        for (const chat of assignedChats) {
                                            let chatName = chat.chatName.toLowerCase()

                                            if (chatName.includes(searchQuery)) {
                                                searchedValues.push(chat)
                                                setAssignedChats(searchedValues)
                                            }
                                        }
                                    }
                                } else {
                                    setAssignedChats(userData._assignedChats)
                                    setOwnChats(userData._ownChats)
                                }
                            }}
                        />
                        <button type="submit" className="search__button" onClick={(e) => {
                            e.preventDefault()
                        }}>Search</button>
                    </form>
                    <div className="more__actions__wrapper">
                        {/* <img src={funnel} alt="" className="action__icon" /> */}
                        <img src={addLead} alt="" className="action__icon" onClick={() => {
                            setShowModal(true)
                        }} />
                        {/* <img src={setting} alt="" className="action__icon" /> */}
                    </div>
                </div>
                {
                    showChat ? <div className="app__chats__directory">       <div className="chat__list__wrapper">
                        <div className="chat__list__wrapper__header">
                            <img src={inbox} alt="" className="header__icon" />
                            <span>Inbox</span>
                        </div>
                        <div className="chat__list__wrapper__chats">
                            {
                                userData._teamRole === 'seller' ? chats === 'WP Leads' ? ownChats.map((chat, index) => {
                                    return (
                                        <div className="chat" key={index} id={chat.chatNumber} onClick={() => {
                                            window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, chat.chatId);
                                            socket.emit("get_chat_details", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber: chat.chatNumber, origin: true }, (err) => {
                                                if (err) {
                                                    window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, chat.chatId)
                                                    myFunction(err)
                                                }
                                            })
                                        }} >
                                            <img src={profile} alt="" className="chat__icon" id={chat.chatLabel} />
                                            <div className="lead__details">
                                                <span className="leadname">{chat.chatName.length > 20 ? `${chat.chatName.substring(0, 20)}...` : chat.chatName}</span>
                                                <span className="lastmessage">{chat.from === 'client' ? `Lead : ${chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}` : `You : ${chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}`}</span>
                                            </div>
                                            <img src={chat.chatLabel === 'Neutral' ? neutral : chat.chatLabel === 'Urgent' ? urgent : chat.chatLabel === 'Important' ? important : chat.chatLabel === 'Slope' ? slope : chat.chatLabel === 'Stuck' ? stuck : chat.chatLabel === 'Cancelled' ? cancelled : chat.chatLabel === 'Done' ? done : ""} alt="" className="label__icon" />
                                        </div>
                                    )
                                }) : "" : userData._teamRole !== 'seller' ? chats === "WP Leads" ? ownChats.map((chat, index) => {
                                    return (
                                        <div className="chat" key={index} id={chat.chatNumber} onClick={() => {
                                            window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, chat.chatId);
                                            socket.emit("get_chat_details", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber: chat.chatNumber }, (err) => {
                                                if (err) {
                                                    window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, chat.chatId)
                                                    myFunction(err)
                                                }
                                            })
                                        }} >
                                            <img src={profile} alt="" className="chat__icon" id={chat.chatLabel} />
                                            <div className="lead__details">
                                                <span className="leadname">{chat.chatName.length > 20 ? `${chat.chatName.substring(0, 20)}...` : chat.chatName}</span>
                                                <span className="lastmessage">{chat.from === 'client' ? `Lead : ${chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}` : `You : ${chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}`}</span>
                                            </div>
                                            <img src={chat.chatLabel === 'Neutral' ? neutral : chat.chatLabel === 'Urgent' ? urgent : chat.chatLabel === 'Important' ? important : chat.chatLabel === 'Slope' ? slope : chat.chatLabel === 'Stuck' ? stuck : chat.chatLabel === 'Cancelled' ? cancelled : chat.chatLabel === 'Done' ? done : ""} alt="" className="label__icon" />
                                        </div>
                                    )
                                }) : chats === "CL Leads" ? () => {

                                } : chats === "Assigned chats" ? assignedChats.map((chat, index) => {
                                    return (
                                        <div className="chat" key={index} id={chat.chatNumber} onClick={() => {
                                            window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, chat.chatId);
                                            socket.emit("get_chat_details", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatNumber: chat.chatNumber, origin: true }, (err) => {
                                                if (err) {
                                                    window.localStorage.setItem(import.meta.env.VITE_APP_USER_CHAT_SESSION_DATA_TOKEN, chat.chatId)
                                                    myFunction(err)
                                                }
                                            })
                                        }} >
                                            <img src={profile} alt="" className="chat__icon" id={chat.chatLabel} />
                                            <div className="lead__details">
                                                <span className="leadname">{chat.chatName.length > 20 ? `${chat.chatName.substring(0, 20)}...` : chat.chatName}</span>
                                                <span className="lastmessage">{chat.from === 'client' ? `Lead : ${chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}` : `You : ${chat.lastMessage.length > 20 ? `${chat.lastMessage.substring(0, 20)}...` : chat.lastMessage}`}</span>
                                            </div>
                                            <img src={chat.chatLabel === 'Neutral' ? neutral : chat.chatLabel === 'Urgent' ? urgent : chat.chatLabel === 'Important' ? important : chat.chatLabel === 'Slope' ? slope : chat.chatLabel === 'Stuck' ? stuck : chat.chatLabel === 'Cancelled' ? cancelled : chat.chatLabel === 'Done' ? done : ""} alt="" className="label__icon" />
                                        </div>
                                    )
                                }) : null : ""
                            }
                        </div>
                    </div>
                        <div className="chat__box">
                            {
                                displayChat ? "" : <div className='top__layer' />
                            }
                            <div className="topbar">
                                <img src={profile} alt="" />
                                <div className="lead__details">
                                    <p className="name">{chatDetails.chatName}</p>
                                </div>
                            </div>
                            <div className="chatbox" id="chatbox">
                                {
                                    chatDetails.chatMessages.map((chat, index) => {
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
                                                        <span className='user'>{'Lead'} |&nbsp;</span>
                                                        <span className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</span>
                                                        <span className='date'>{chat.timestamp.substring(16, 25)}</span>
                                                    </div>
                                                </div>
                                            )
                                        } else if (chat.type === 'note') {
                                            return (
                                                <div className={`note ${chat.from === "client" ? "client" : "seller"}`} key={index}>
                                                    <i className='dataFor'>{chat.data}</i>
                                                    <div className="timestamps">
                                                        <span className='user'>{chat.caption.substring(chat.caption.substring(" "))} |&nbsp;</span>
                                                        <span className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</span>
                                                        <span className='date'>{chat.timestamp.substring(16, 25)}</span>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className={`message ${chat.from === "client" ? "client" : "seller"}`} key={index}>
                                                    <p>{chat.data}</p>
                                                    <div className="timestamps">
                                                        <span className='user'>{chat.caption.length > 0 ? chat.caption.substring(chat.caption.substring(" ")) : 'Lead'} |&nbsp;</span>
                                                        <span className='day'>{chat.timestamp.substring(4, 11)} |&nbsp;</span>
                                                        <span className='date'>{chat.timestamp.substring(16, 25)}</span>
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
                                <form className="send__message__wrapper">
                                    <input type="text" value={message} placeholder="Type a message...." id="message" onChange={handleMessageChange} />
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
                        <div className="infobox">
                            {
                                displayChat ? "" : <div className='top__layer' />
                            }
                            <div className="chat__list__wrapper__header">
                                <img src={inbox} alt="" className="header__icon" />
                                <span>Details</span>
                                <img src={trash} alt="" onClick={() => {
                                    deleteChat(chatDetails.chatNumber)
                                }} className="header__icon p-absolute" />
                            </div>
                            {
                                userData._teamRole === 'seller' ? chats === 'WP Leads' ? <div className="infobox__details">
                                    <div className="intro">
                                        <img src={profile} alt="" />
                                        <div className="details">
                                            <p className="details__name">
                                                {chatDetails.chatName.substring(0, 18)}
                                            </p>
                                            <p className="details__number">
                                                {chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="details__chat">
                                        <div className="tooltip">
                                            <img src={infoName} alt="" />
                                            <span className="tooltiptext">{infoNameBox}</span>
                                            <span type="text" className='data'>{chatDetails.chatName.substring(0, 15)}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={infoPhone} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}</span>
                                            <span type="text" className='data'>{chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={gain} alt="" />
                                            <span className="tooltiptext">{infoGainBox}</span>
                                            <input type="text" className='data' id='infoName' value={`${infoGainBox}`} onChange={(e) => {
                                                setInfoGainBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={calendar} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatDate}</span>
                                            <span className='data'>{chatDetails.chatDate.substring(0, 10)}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={email} alt="" />
                                            <span className="tooltiptext">{infoEmailBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoEmailBox} onChange={(e) => {
                                                setInfoEmailBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={campaign} alt="" />
                                            <span className="tooltiptext">{infoCampaignBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoCampaignBox} onChange={(e) => {
                                                setInfoCampaignBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={business} alt="" />
                                            <span className="tooltiptext">{infoBusinessBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoBusinessBox} onChange={(e) => {
                                                setInfoBusinessBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={target} alt="" />
                                            <span className="tooltiptext">{infoOjectiveBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoOjectiveBox} onChange={(e) => {
                                                setInfoObjectiveBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={platform} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatPlatform === 'crm' ? "Idealidad" : chatDetails.chatPlatform === 'wp' ? 'WhatsApp' : chatDetails.chatPlatform === 'fb' ? "Facebook" : chatDetails.chatPlatform === 'ig' ? "Instagram" : "Direct"}</span>
                                            <span className='data'>
                                                {chatDetails.chatPlatform === 'crm' ? "Idealidad" : chatDetails.chatPlatform === 'wp' ? 'WhatsApp' : chatDetails.chatPlatform === 'fb' ? "FaceBook" : chatDetails.chatPlatform === 'ig' ? "Instagram" : "Messages"}
                                            </span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="funnel__name">
                                            <img src={tags} alt="" />
                                            {chatDetails.chatLabel}
                                            <div className="color"></div>
                                        </div>
                                        {
                                            userData._teamRole !== 'dead' ? <select name="" id="status" className="action__select" onChange={updateChatStatus}>
                                                <option value="false">Add label to chat...</option>
                                                <option value="Neutral">Neutral</option>
                                                <option value="Urgent">Urgent</option>
                                                <option value="Important">Important</option>
                                                <option value="Slope">Slope</option>
                                                <option value="Stuck">Stuck</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Done">Done</option>
                                            </select> : null
                                        }
                                        <div className="funnel__name">
                                            <img src={management} alt="" />
                                            {chatDetails.chatHandlerName.length > 15 ? `${chatDetails.chatHandlerName.substring(0, 15)}...` : chatDetails.chatHandlerName}
                                            <div className="color"></div>
                                        </div>
                                        <div className="funnel__name button" onClick={updateChatDetails}>
                                            <span>Save</span>
                                        </div>
                                    </div>
                                </div> : "" : chats === 'WP Leads' ? <div className="infobox__details">
                                    <div className="intro">
                                        <img src={profile} alt="" />
                                        <div className="details">
                                            <p className="details__name">
                                                {chatDetails.chatName.substring(0, 18)}
                                            </p>
                                            <p className="details__number">
                                                {chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="details__chat">
                                        <div className="tooltip">
                                            <img src={infoName} alt="" />
                                            <span className="tooltiptext">{infoNameBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoNameBox} onChange={(e) => {
                                                setInfoNameBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={infoPhone} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}</span>
                                            <span type="text" className='data'>{chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={gain} alt="" />
                                            <span className="tooltiptext">{infoGainBox}</span>
                                            <input type="text" className='data' id='infoName' value={`${infoGainBox}`} onChange={(e) => {
                                                setInfoGainBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={calendar} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatDate}</span>
                                            <span className='data'>{chatDetails.chatDate.substring(0, 10)}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={email} alt="" />
                                            <span className="tooltiptext">{infoEmailBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoEmailBox} onChange={(e) => {
                                                setInfoEmailBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={campaign} alt="" />
                                            <span className="tooltiptext">{infoCampaignBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoCampaignBox} onChange={(e) => {
                                                setInfoCampaignBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={business} alt="" />
                                            <span className="tooltiptext">{infoBusinessBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoBusinessBox} onChange={(e) => {
                                                setInfoBusinessBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={target} alt="" />
                                            <span className="tooltiptext">{infoOjectiveBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoOjectiveBox} onChange={(e) => {
                                                setInfoObjectiveBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={platform} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatPlatform === 'crm' ? "Idealidad" : chatDetails.chatPlatform === 'wp' ? 'WhatsApp' : chatDetails.chatPlatform === 'fb' ? "Facebook" : chatDetails.chatPlatform === 'ig' ? "Instagram" : "Direct"}</span>
                                            <span className='data'>
                                                {chatDetails.chatPlatform === 'crm' ? "Idealidad" : chatDetails.chatPlatform === 'wp' ? 'WhatsApp' : chatDetails.chatPlatform === 'fb' ? "FaceBook" : chatDetails.chatPlatform === 'ig' ? "Instagram" : "Messages"}
                                            </span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={directory} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatDirectory}</span>
                                            <span className='data'>{chatDetails.chatDirectory ? chatDetails.chatDirectory.length > 15 ? `${chatDetails.chatDirectory.substring(0, 15)}...` : chatDetails.chatDirectory : ""}
                                            </span>
                                            <div className="color"></div>
                                        </div>
                                        <select name="" id="directory" className="action__select" onChange={updateChatDirectory}>
                                            <option value="false">Send chat to directory...</option>
                                            {
                                                userData._directories.length > 0 ?
                                                    userData._directories.map(directory => {
                                                        return (
                                                            <option value={directory.directoryId} key={directory.directoryId}>{directory.directoryName}</option>
                                                        )
                                                    }) : ""
                                            }
                                        </select>
                                        <div className="tooltip">
                                            <img src={infoFunnel} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatFunnel}</span>
                                            <span className='data'>{chatDetails.chatFunnel.length > 15 ? `${chatDetails.chatFunnel.substring(0, 15)}...` : chatDetails.chatFunnel}
                                            </span>
                                            <div className="color"></div>
                                        </div>
                                        <select name="" id="funnel" className="action__select" onChange={updateChatFunnel}>
                                            <option value="false">Send chat to funnel...</option>
                                            {
                                                userData._funnels.length > 0 ?
                                                    userData._funnels.map(funnel => {
                                                        return (
                                                            <option value={funnel.funnelId} key={funnel.funnelId}>{funnel.funnelName}</option>
                                                        )
                                                    }) : ""
                                            }
                                        </select>
                                        <div className="funnel__name">
                                            <img src={tags} alt="" />
                                            {chatDetails.chatLabel}
                                            <div className="color"></div>
                                        </div>
                                        {
                                            userData._teamRole !== 'dead' ? <select name="" id="status" className="action__select" onChange={updateChatStatus}>
                                                <option value="false">Add label to chat...</option>
                                                <option value="Neutral">Neutral</option>
                                                <option value="Urgent">Urgent</option>
                                                <option value="Important">Important</option>
                                                <option value="Slope">Slope</option>
                                                <option value="Stuck">Stuck</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Done">Done</option>
                                            </select> : null
                                        }
                                        <div className="funnel__name">
                                            <img src={management} alt="" />
                                            {chatDetails.chatHandlerName.length > 15 ? `${chatDetails.chatHandlerName.substring(0, 15)}...` : chatDetails.chatHandlerName}
                                            <div className="color"></div>
                                        </div>
                                        {
                                            userData._teamRole === 'admin' ? <select name="" id="handler" className="action__select" onChange={assignChat}>
                                                <option value="false">Assign chat to member...</option>
                                                {
                                                    userTeamData._teamMembers.length > 0 ?
                                                        userTeamData._teamMembers.map(member => {
                                                            return (
                                                                <option value={member.id} key={member.id}>{member.name}</option>
                                                            )
                                                        }) : ""
                                                }
                                            </select> : null
                                        }
                                        <div className="funnel__name button" onClick={updateChatDetails}>
                                            <span>Save</span>
                                        </div>
                                    </div>
                                </div> : chats === 'Assigned chats' ? <div className="infobox__details">
                                    <div className="intro">
                                        <img src={profile} alt="" />
                                        <div className="details">
                                            <p className="details__name">
                                                {chatDetails.chatName.substring(0, 18)}
                                            </p>
                                            <p className="details__number">
                                                {chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="details__chat">
                                        <div className="tooltip">
                                            <img src={infoName} alt="" />
                                            <span className="tooltiptext">{infoNameBox}</span>
                                            <span type="text" className='data'>{chatDetails.chatName.substring(0, 15)}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={infoPhone} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}</span>
                                            <span type="text" className='data'>{chatDetails.chatNumber.substring(0, chatDetails.chatNumber.indexOf('@'))}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={gain} alt="" />
                                            <span className="tooltiptext">{infoGainBox}</span>
                                            <input type="text" className='data' id='infoName' value={`${infoGainBox}`} onChange={(e) => {
                                                setInfoGainBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={calendar} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatDate}</span>
                                            <span className='data'>{chatDetails.chatDate.substring(0, 10)}</span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={email} alt="" />
                                            <span className="tooltiptext">{infoEmailBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoEmailBox} onChange={(e) => {
                                                setInfoEmailBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={campaign} alt="" />
                                            <span className="tooltiptext">{infoCampaignBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoCampaignBox} onChange={(e) => {
                                                setInfoCampaignBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={business} alt="" />
                                            <span className="tooltiptext">{infoBusinessBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoBusinessBox} onChange={(e) => {
                                                setInfoBusinessBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={target} alt="" />
                                            <span className="tooltiptext">{infoOjectiveBox}</span>
                                            <input type="text" className='data' id='infoName' value={infoOjectiveBox} onChange={(e) => {
                                                setInfoObjectiveBox(e.target.value)
                                            }} />
                                            <div className="color"></div>
                                        </div>
                                        <div className="tooltip">
                                            <img src={platform} alt="" />
                                            <span className="tooltiptext">{chatDetails.chatPlatform === 'crm' ? "Idealidad" : chatDetails.chatPlatform === 'wp' ? 'WhatsApp' : chatDetails.chatPlatform === 'fb' ? "Facebook" : chatDetails.chatPlatform === 'ig' ? "Instagram" : "Direct"}</span>
                                            <span className='data'>
                                                {chatDetails.chatPlatform === 'crm' ? "Idealidad" : chatDetails.chatPlatform === 'wp' ? 'WhatsApp' : chatDetails.chatPlatform === 'fb' ? "FaceBook" : chatDetails.chatPlatform === 'ig' ? "Instagram" : "Messages"}
                                            </span>
                                            <div className="color"></div>
                                        </div>
                                        <div className="funnel__name">
                                            <img src={tags} alt="" />
                                            {chatDetails.chatLabel}
                                            <div className="color"></div>
                                        </div>
                                        {
                                            userData._teamRole !== 'dead' ? <select name="" id="status" className="action__select" onChange={updateChatStatus}>
                                                <option value="false">Add label to chat...</option>
                                                <option value="Neutral">Neutral</option>
                                                <option value="Urgent">Urgent</option>
                                                <option value="Important">Important</option>
                                                <option value="Slope">Slope</option>
                                                <option value="Stuck">Stuck</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Done">Done</option>
                                            </select> : null
                                        }
                                        <div className="funnel__name">
                                            <img src={management} alt="" />
                                            {chatDetails.chatHandlerName.length > 15 ? `${chatDetails.chatHandlerName.substring(0, 15)}...` : chatDetails.chatHandlerName}
                                            <div className="color"></div>
                                        </div>
                                        <div className="funnel__name button" onClick={updateChatDetails}>
                                            <span>Save</span>
                                        </div>
                                    </div>
                                </div> : ""
                            }

                        </div>
                    </div> : <div className="app__chats__directory">
                        <div className="info__div">
                            <span>Select a category from the above category menu to see its data</span>
                        </div>
                    </div>
                }
                <Footer />
            </div>
        </>
    )
}

export default Chats
