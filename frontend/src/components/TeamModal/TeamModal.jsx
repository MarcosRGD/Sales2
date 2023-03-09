import React, { useEffect, useState } from 'react'
import { exit, network, smartphone, construction, team, addLead, deleteIcon } from '../../assets';
import './teammodal.scss'

const TeamModal = ({ showTeamModal, setShowTeamModal, userRole, socket, userAuthToken, teamId }) => {
    const [form, setForm] = useState("end")
    const [form2, setForm2] = useState("end")

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
        var modal = document.getElementById("teamModal");
        if (showTeamModal) {
            modal.style.display = "flex";
        } else {
            modal.style.display = "none";
            setForm("end")
        }
    }, [showTeamModal, userRole]);

    window.onclick = function (event) {
        var modal = document.getElementById("teamModal");
        if (event.target === modal) {
            setShowTeamModal(false);
            setForm("end")
            setForm2("end")
        };
    }

    const createTeam = () => {
        const teamName = document.getElementById('team_name').value === "" ? "" : document.getElementById('team_name').value

        const teamPassword = document.getElementById('team_password').value === "" ? "" : document.getElementById('team_password').value

        if (teamName !== "" && teamPassword !== "") {
            socket.emit("register_user_team", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, teamName, teamPassword }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please fill up all the fields...')
        }
    }

    const joinTeam = () => {
        const teamId = document.getElementById('name').value === "" ? "" : document.getElementById('name').value

        const teamPassword = document.getElementById('password').value === "" ? "" : document.getElementById('password').value

        if (teamId !== "" && teamPassword !== "") {
            socket.emit("join_team", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, teamId, teamPassword }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please fill up all the fields...')
        }
    }

    const leaveTeam = () => {
        if (teamId !== "") {
            console.log("Emmiting left req")
            socket.emit("leave_team", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, teamId }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction('Please fill up all the fields...')
        }
    }

    const addMember = () => {
        var memberName =
            document.getElementById("member_name").value === ""
                ? ""
                : document.getElementById("member_name").value;
        var memberEmail =
            document.getElementById("member_email").value === ""
                ? ""
                : document.getElementById("member_email").value;
        var memberPassword =
            document.getElementById("member_password").value.length < 8
                ? ""
                : document.getElementById("member_password").value;
        if (memberName !== "" && memberEmail !== "" && memberPassword !== "") {
            console.log("sending")
            socket.emit("add_member", { authToken: userAuthToken, password: import.meta.env.VITE_APP_SERVER_SOCKET_PASSWORD, teamId, memberName, memberEmail, memberPassword }, (err) => {
                if (err) {
                    myFunction(err)
                }
            })
        } else {
            myFunction("Please fill up all the fields....");
        }
    }

    useEffect(() => {
        setForm('end')
        setForm2('end')
    }, [userRole])

    return (
        <div id='teamModal' className='t-modal'>
            <div className="t-modal-content">
                <span className="close" onClick={() => {
                    setShowTeamModal(false)
                    setForm("end")
                    setForm2('end')
                }}>&times;</span>

                {
                    form2 === 'end' ? userRole === 'neutral' ? <div div className="wrapper">
                        <div className="team__action" onClick={() => {
                            setForm('create')
                            setForm2('start')
                        }}>
                            <span>Create Team</span>
                            <img src={team} alt="" />
                        </div>
                        <div className="team__action" onClick={() => {
                            setForm('join')
                            setForm2('start')
                        }}>
                            <span>Join Team</span>
                            <img src={addLead} alt="" />
                        </div>
                    </div> : userRole === 'seller' ? <div className="constructionMessage">
                        <img src={exit} alt="" onClick={leaveTeam} />
                    </div> : userRole === 'admin' ? <div className="modal-content" id='form'>
                        <span className="header" id='header'>
                            Add New Member
                        </span>
                        <input className="inputFields" type="text" name="" id="member_name" placeholder="Member Name" />
                        <input className="inputFields" type="email" name="" id="member_email" placeholder="Member Email" />
                        <input className="inputFields" type="password" name="" id="member_password" placeholder="Member Password" />
                        <button onClick={addMember}>Add</button>
                    </div> : "" : ""
                }

                {
                    form === 'create' ? <div className="modal-content" id='form'>
                        <span className="header" id='header'>
                            Create New Team
                        </span>
                        <input className="inputFields" type="text" name="" id="team_name" placeholder="Team Name" />
                        <input className="inputFields" type="password" name="" id="team_password" placeholder="Team password" />
                        <button onClick={createTeam}>Create</button>
                    </div> : form === 'join' ? <div className="modal-content" id='form'>
                        <span className="header" id='header'>
                            Join A Team
                        </span>
                        <input className="inputFields" type="text" name="" id="name" placeholder="Team Id" />
                        <input className="inputFields" type="password" name="" id="password" placeholder="Team password" />
                        <button onClick={joinTeam}>Join</button>
                    </div> : ""
                }
            </div>
        </div >
    )
}

export default TeamModal
