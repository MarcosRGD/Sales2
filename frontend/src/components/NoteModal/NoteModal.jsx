import React, { useEffect } from "react";

import "./notemodal.scss";

const NoteModal = ({ chatDetails, showModal, setShowModal, permission, socket }) => {
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

    useEffect(() => {
        var modal = document.getElementById("noteModal");
        if (showModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
        }

        permission ? null : setShowModal(false);
    }, [showModal, permission]);

    window.onclick = function (event) {
        var modal = document.getElementById("noteModal");
        if (event.target == modal) {
            setShowModal(false);
        }
    };

    const sendNote = (e) => {
        if (document.getElementById("note").value === "") {
            myFunction('Please type a message...')
        } else {
            e.preventDefault()
            socket.emit("add_note", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, clientNumber: `${chatDetails.chatNumber}`, permission, message: document.getElementById("note").value }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
            var x = document.getElementById("message")
            x.value = "";
            setShowModal(false)
        }
    }


    return (
        <div id="noteModal" className="modal">
            <div className="close" onClick={() => {
                setShowModal(false);
            }}>
                <span>
                    x
                </span>
            </div>
            <div className="modal-content">
                <span className="header">
                    New Note
                </span>
                <input type="text" name="" id="note" placeholder="Note" />
                <button onClick={sendNote}>Create</button>
            </div>
        </div>
    );
};

export default NoteModal;
