import React, { useEffect } from "react";
import {
    brokenLink,
    exit,
    facebook,
    instagram,
    integration,
    link,
    management,
    plus,
    sheets,
    teamwork,
    user,
    whatsapp,
    hourglass
} from "../../assets";
import Loader from "../Loader/Loader";
import './authmodal.scss'

const AuthModal = ({ showModal }) => {

    useEffect(() => {
        var modal = document.getElementById("authModal");
        if (showModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
        }

    }, [showModal]);


    return (
        <div id="authModal" className="modal">
            <div className="modal-content-auth">
                <span className="header">
                    Authenticating Whatsapp Web
                </span>
                <img src={whatsapp} alt="" />
                <Loader />
            </div>
        </div>
    );
};

export default AuthModal;
