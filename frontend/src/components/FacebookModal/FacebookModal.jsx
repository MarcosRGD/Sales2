import React, { useEffect, useState } from "react";
import { disconnect, facebook } from "../../assets";
import Loader from "../Loader/Loader";
import "./facebookmodal.scss";

const FacebookModal = ({ authToken, showFbModal, setShowFbModal, socket, user }) => {


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
        var modal = document.getElementById("facebookModal");
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
        var modal = document.getElementById("facebookModal");
        if (event.target == modal) {
            setShowFbModal(false);
        }
    };

    return (
        <div id="facebookModal" className="g-modal">
            {
                !user._fbIntegration ? <div className="g-modal-content">
                    <div className="g-modal-header">
                        <span className="close" onClick={() => {
                            setShowFbModal(false)
                        }}>&times;</span>
                        <img src={facebook} alt="" />
                        <span>Facebook Integration</span>
                    </div>
                    <div className="g-modal-body">
                        <div className="instruction">
                            <img src={disconnect} alt="" />
                            <span style={{ marginTop: '10px'}}>
                            Only Super Admins Of the Idealidad Saleshub Crm can assign facebook campaigns to the other teams. Please request your super admins to assign you a facebook campaign.
                        </span>
                        <button onClick={() => {
                            setTimeout(() => {
                                myFunction('Request send to super admin...')
                            })
                        }} style={{width: '100%', marginTop: '20px'}}>Send Request →</button>
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

export default FacebookModal;
