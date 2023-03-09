import React, { useEffect } from "react";

import "./funnelmodal.scss";

const FunnelModal = ({ showModal, setShowModal, permission, socket }) => {
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
        var modal = document.getElementById("funnelModal");
        if (showModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
        }

        permission ? null : setShowModal(false);
    }, [showModal, permission]);

    window.onclick = function (event) {
        var modal = document.getElementById("funnelModal");
        if (event.target == modal) {
            setShowModal(false);
        }
    };

    const addFunnel = () => {
        console.log("Hello")
        var name = document.getElementById('name').value
        if (name === "") {
            myFunction('Please provide funnel name...')
        } else {
            socket.emit("add_funnel", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, funnelName: name }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        }
    }

    return (
        <div id="funnelModal" className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => {
                    setShowModal(false);
                }}>
                    <span>
                        &times;
                    </span>
                </div>
                <span className="header">
                    New Funnel
                </span>
                <input className="inputFields" type="text" name="" id="name" placeholder="Name" />
                <button onClick={addFunnel}>Create</button>
            </div>
        </div>
    );
};

export default FunnelModal;
