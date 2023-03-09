import React, { useEffect, useState } from "react";
import {
    attachment,
    event,
    microphone,
    notes,
    power,
    profile,
    smiling,
} from "../../assets";

import "./createchatmodal.scss";

const CreateChatModal = ({ showModal, setShowModal, permission, socket }) => {
    const userAuthToken = JSON.parse(window.localStorage.getItem(
        `${import.meta.env.VITE_APP_USER_LOGGED_IN_DATA_TOKEN}`
    ));

    function myFunction(message) {
        var x = document.getElementById("snackbar");
        x.className.replace("show", "")
        x.className = "show";
        x.innerText = message;

        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 3000);
    }

    useEffect(() => {
        var modal = document.getElementById("createChatModal");
        if (showModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
        }

        permission ? null : setShowModal(false);
    }, [showModal, permission]);

    window.onclick = function (event) {
        var modal = document.getElementById("createChatModal");
        if (event.target == modal) {
            setShowModal(false);
        }
    };

    const addChat = () => {
        console.log('Sending reQuest form chreate')
        var name = document.getElementById('name').value
        if (name === "") {
            myFunction('Please provide name...')
        }
        var number = document.getElementById('number').value
        if (number === "") {
            myFunction('Please provide number...')
        }
        var prefix = document.getElementById('prefix').value
        if (prefix === "") {
            myFunction('Please provide prefix...')
        }
        var objective = document.getElementById('objective').value
        var campaign = document.getElementById('campaign').value
        var email = document.getElementById('email').value
        var business = document.getElementById('business').value

        var chatDetails = {
            name,
            number: `${prefix}${number}@c.us`,
            objective,
            campaign,
            email,
            business
        }
        
        if (name !== "") {
            if (prefix !== "") {
                if (number !== "") {
                    socket.emit("add_chat", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, chatDetails }, (err) => {
                        if (err) {
                            myFunction(err)
                        }
                    })
                }
            }
        }
    }


    return (
        <div id="createChatModal" className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => {
                    setShowModal(false);
                }}>
                    <span>
                        &times;
                    </span>
                </div>
                <span className="header">
                    Create New Chat
                </span>
                <input className="inputFields" type="text" name="" id="name" placeholder="Name" />
                <input className="inputFields" type="number" name="" id="prefix" placeholder="Prefix" />
                <input className="inputFields" type="number" name="" id="number" placeholder="Number" />
                <input className="inputFields" type="text" name="" id="email" placeholder="Email" />
                <input className="inputFields" type="text" name="" id="campaign" placeholder="Campaign" />
                <input className="inputFields" type="text" name="" id="business" placeholder="Business" />
                <input className="inputFields" type="text" name="" id="objective" placeholder="Objective" />
                <button onClick={addChat}>Create</button>
            </div>
        </div>
    );
};

export default CreateChatModal;
