import React, { useEffect, useState } from "react";

import "./directorymodal.scss";

const DirectoryModal = ({ showModal, setShowModal, permission, socket }) => {
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
        var modal = document.getElementById("DirectoryModal");
        if (showModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
        }

        permission ? null : setShowModal(false);
    }, [showModal, permission]);

    window.onclick = function (event) {
        var modal = document.getElementById("DirectoryModal");
        if (event.target == modal) {
            setShowModal(false);
        }
    };

    const showGs = (flag) => {
        if (flag) {
            var gswarning = document.getElementById('gswarning')
            var gsname = document.getElementById('gsname')
            gsname.style.display = 'block'
            gswarning.style.display = 'flex'
        } else {
            var gswarning = document.getElementById('gswarning')
            var gsname = document.getElementById('gsname')
            gsname.style.display = 'none'
            gswarning.style.display = 'none'
        }
    }

    const addDir = () => {
        var directoryName = document.getElementById('dirname').value
        var googlesheetname = document.getElementById('gsname').value
        var facebookIntegration = document.getElementById('facebook').checked
        var allIntegration = document.getElementById('all').checked

        if (directoryName) {
            if (facebookIntegration || allIntegration) {
                socket.emit("add_directory", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, facebookIntegration, allIntegration, googlesheetname, directoryName }, (err) => {
                    if (err) {
                        myFunction(err)
                    }
                })
            } else {
                myFunction('Please provide the method...')
            }
        } else {
            myFunction('Please provide the directory name...')
        }
    }


    return (
        <div id="DirectoryModal" className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => {
                    setShowModal(false);
                }}>
                    <span>
                        &times;
                    </span>
                </div>
                <span className="header">
                    Create New Directory
                </span>
                <input className="inputFields" type="text" name="" id="dirname" placeholder="Directory name" />
                <div className="warning">
                    <i className="warning_text">1) The headers of the columns are predefined</i>
                    <i className="warning_text">2) The headers are as follow: </i>
                    <i className="warning_text">3) Date </i>
                    <i className="warning_text">4) Platform </i>
                    <i className="warning_text">5) Name </i>
                    <i className="warning_text">6) Email </i>
                    <i className="warning_text">7) Telephone </i>
                    <i className="warning_text">8) Campaign </i>
                    <i className="warning_text">9) Business </i>
                    <i className="warning_text">10) Objective </i>
                    <i className="warning_text">11) If you are importing the data from any googlesheet make sure you also have the data in the same format given above </i>
                </div>
                <div className="radio_boxes">
                    <label htmlFor="import">
                        Import Data
                        <input type="radio" name="data" id="import" onClick={() => {
                            showGs(true)
                        }} />
                    </label>
                    <label htmlFor="add">
                        New Data
                        <input type="radio" name="data" id="add" onClick={() => {
                            showGs(false)
                        }} />
                    </label>
                </div>
                <div className="warning" id="gswarning">
                    <i className="warning_text">
                        Make sure that you have connected the googlesheet required for the directory. After that enter the sheet name to import its data
                    </i>
                </div>
                <input className="inputFields" type="text" name="" id="gsname" placeholder="GoogleSheet name" />
                <div className="radio_boxes">
                    <label htmlFor="facebook">
                        Facebook Leads
                        <input type="checkbox" name="import" id="facebook" />
                    </label>
                    <label htmlFor="all">
                        All Leads
                        <input type="checkbox" name="import" id="all" />
                    </label>
                </div>
                <button onClick={() => {
                    addDir()
                }}>Create</button>
            </div>
        </div>
    );
};

export default DirectoryModal;
