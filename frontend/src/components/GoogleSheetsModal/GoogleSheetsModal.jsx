import React, { useEffect } from 'react'
import { disconnect, sheets, done } from '../../assets';
import './googlesheetsmodal.scss'

const GoogleSheetsModal = ({ showGsModal, setShowGsModal, socket, authToken, user, userTeam }) => {


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
        var modal = document.getElementById("googleSheetModal");
        if (showGsModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
        }
    }, [showGsModal]);

    window.onclick = function (event) {
        var modal = document.getElementById("googleSheetModal");
        if (event.target == modal) {
            setShowGsModal(false);
        }
    };


    const emitGsIntegrationRequest = async (e) => {
        e.preventDefault();
        var id = document.getElementById('spreadsheetId').value === "" ? "" : document.getElementById('spreadsheetId').value

        if (id !== "") {
            socket.emit("integrate_googlesheets", { authToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, spreadsheetId: document.getElementById('spreadsheetId').value }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please specify the spreadsheet Id...')
        }
    }

    return (
        <div id="googleSheetModal" className="g-modal">
            {
                user._teamRole === 'neutral' ? user._gsIntegration ? <div className="w-modal-content">
                    <div className="w-modal-header">
                        <span className="close" onClick={() => {
                            setShowGsModal(false)
                        }}>&times;</span>
                        <img src={sheets} alt="" />
                        <span>Google Sheets Integration</span>
                    </div>
                    <div className="w-modal-body">
                        <div className="w-modal-body-center">
                            <img src={done} alt="" className="disconnect" />
                        </div>
                    </div>
                </div> : <div className="g-modal-content">
                    <div className="g-modal-header">
                        <span className="close" onClick={() => {
                            setShowGsModal(false)
                        }}>&times;</span>
                        <img src={sheets} alt="" />
                        <span>Google Sheets Integration</span>
                    </div>
                    <div className="g-modal-body">
                        <div className="g-modal-body-left">
                            <span className="g-modal-body-header">
                                To use Google Sheets with Saleshub:
                            </span>
                            <ul>
                                <li>1) Open the sheet on your desktop.</li>
                                <li>
                                    2) Share that sheet to <a>saleshub-database@automated-lodge-356009.iam.gserviceaccount.com</a>
                                </li>
                                <li>3) Copy the sheet id from the url and enter it here: <form>            <input type="text" id="spreadsheetId" />
                                    <button type="submit" onClick={emitGsIntegrationRequest}>Send message</button> </form> </li>
                                <li>4) Press enter after completing all the above steps.</li>
                            </ul>
                        </div>
                    </div>
                </div> : user._teamRole !== 'neutral' ? userTeam._gsIntegration ? <div className="w-modal-content">
                    <div className="w-modal-header">
                        <span className="close" onClick={() => {
                            setShowGsModal(false)
                        }}>&times;</span>
                        <img src={sheets} alt="" />
                        <span>Google Sheets Integration</span>
                    </div>
                    <div className="w-modal-body">
                        <div className="w-modal-body-center">
                            <img src={disconnect} alt="" className="disconnect" />
                        </div>
                    </div>
                </div> : <div className="g-modal-content">
                    <div className="g-modal-header">
                        <span className="close" onClick={() => {
                            setShowGsModal(false)
                        }}>&times;</span>
                        <img src={sheets} alt="" />
                        <span>Google Sheets Integration</span>
                    </div>
                    <div className="g-modal-body">
                        <div className="g-modal-body-left">
                            <span className="g-modal-body-header">
                                To use Google Sheets with Saleshub:
                            </span>
                            <ul>
                                <li>1) Open the sheet on your desktop.</li>
                                <li>
                                    2) Share that sheet to <a>saleshub-database@automated-lodge-356009.iam.gserviceaccount.com</a>
                                </li>
                                <li>3) Copy the sheet id from the url and enter it here: <form>            <input type="text" id="spreadsheetId" />
                                    <button type="submit" onClick={emitGsIntegrationRequest}>Send message</button> </form> </li>
                                <li>4) Press enter after completing all the above steps.</li>
                            </ul>
                        </div>
                    </div>
                </div> : null}
        </div>
    )
}

export default GoogleSheetsModal
