import React, { useEffect, useState } from "react";
import { construction, disconnect, facebook, instagram, messenger } from "../../assets";
import Loader from "../Loader/Loader";
import "./messengermodal.css";

const MessengerModal = ({ authToken, showFbModal, setShowFbModal, socket, user }) => {


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
        var modal = document.getElementById("messengerModal");
        if (showFbModal) {
            modal.style.display = "flex";

            // if (user._gsIntegration) {
            //     socket.emit("authenticate_facebook", { authToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD }, (err) => {
            //         if (err) {
            //             myFunction(err)
            //         }
            //     })
            // } else {
            //     myFunction('Please integrate google sheets first...')
            // }
        } else {
            modal.style.display = "none";
        }
    }, [showFbModal]);


    window.onclick = function (event) {
        var modal = document.getElementById("messengerModal");
        if (event.target == modal) {
            setShowFbModal(false);
        }
    };

    return (
        <div id="messengerModal" className="g-modal">
            {
                !user._fbIntegration ? <div className="g-modal-content">
                    <div className="g-modal-header">
                        <span className="close" onClick={() => {
                            setShowFbModal(false)
                        }}>&times;</span>
                        <img src={messenger} alt="" />
                        <span>Messenger Integration</span>
                    </div>
                    <div className="g-modal-body">
                        <div className="instruction">
                            <img src={construction} alt="" />
                            <span style={{ marginTop: '10px'}}>
                            Launching with the super admins feature in the app. As it has a data registory into the super admin dashoard. The Messenger integration will be launched with super admin.
                        </span>
                        <button onClick={() => {
                            setTimeout(() => {
                                myFunction('Request send to super admin...')
                            })
                        }} style={{width: '100%', marginTop: '20px'}}>Join Early Access →</button>
                        {/* <Loader /> */}
                    </div>
                </div>
                </div> : <div className="g-modal-content">
        <div className="g-modal-header">
            <span className="close" onClick={() => {
                setShowFbModal(false)
            }}>&times;</span>
            <img src={facebook} alt="" />
            <span>Facebook Integration</span>
        </div>
        <div className="g-modal-body">
            <div className="g-modal-body-center">
                {/* <img src={disconnect} alt="" className="disconnect" /> */}
                <span>Only the super admins of the app can link a facebook page to your profile</span>
            </div>
        </div>
    </div>
}
        </div >
    );
};

export default MessengerModal;
