import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { whatsapp, Ventilator, disconnect, done } from "../../assets";
import Loader from "../Loader/Loader";
import "./whatsappmodal.scss";

const WhatsappModal = ({ showWpModal, setShowWpModal, socket, user }) => {
  const [qr, setQr] = useState("");


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
    setQr("")
    var modal = document.getElementById("whatsappModal");
    if (showWpModal) {
      modal.style.display = "flex";
    } else {
      modal.style.display = "none";
    }
  }, [showWpModal]);

  useEffect(() => {
    socket.on('qr_recieved', ({ password, qr }) => {
      if (password === import.meta.env.VITE_APP_CLIENT_SOCKET_PASSWORD) {
        setQr(qr)
        myFunction('QrCode recieved...')
      }
    })

  })


  window.onclick = function (event) {
    var modal = document.getElementById("whatsappModal");
    if (event.target == modal) {
      setQr("")
      setShowWpModal(false);
    }
  };

  return (
    <div id="whatsappModal" className="w-modal">
      {
        !user._wpIntegration ? <div className="w-modal-content">
          <div className="w-modal-header">
            <span className="close" onClick={() => {
              setShowWpModal(false)
            }}>&times;</span>
            <img src={whatsapp} alt="" />
            <span>Whatsapp Web Integration</span>
          </div>
          <div className="w-modal-body">
            <div className="w-modal-body-left">
              <span className="w-modal-body-header">
                To use WhatsApp with Saleshub:
              </span>
              <ul>
                <li>1) Open Whatsapp on your phone</li>
                <li>
                  2) Tap <b>Menu</b> or <b>Settings</b> and select{" "}
                  <b>Linked Devices</b>
                </li>
                <li>3) Scan the beside Qr Code with your phone</li>
              </ul>
            </div>
            <div className="w-modal-body-right">
              {qr === "" ? <Loader /> : <QRCode value={qr} />}
            </div>
          </div>
        </div> : <div className="w-modal-content">
          <div className="w-modal-header">
            <span className="close" onClick={() => {
              setShowWpModal(false)
            }}>&times;</span>
            <img src={whatsapp} alt="" />
            <span>Whatsapp Web Integration</span>
          </div>
          <div className="w-modal-body">
            <div className="w-modal-body-center">
              <img src={done} alt="" className="disconnect" />
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default WhatsappModal;
