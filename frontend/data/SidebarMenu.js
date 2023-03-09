import { chat, directory, filter, home, logout, fastmessage, question, robot, statistics, user, setting, team } from "../src/assets";

const sidebar = [
    {
        name: "Dashboard",
        image: home,
        value: "dashboard"
    },
    {
        name: "Funnels",
        image: filter,
        value: "funnels"
    },
    {
        name: "Chats",
        image: chat,
        value: "chats"
    },
    {
        name: "Directory",
        image: directory,
        value: "directory"
    },
    {
        name: "Salesbot",
        image: robot,
        value: "salesbot"
    },
    {
        name: "Analytics",
        image: statistics,
        value: "analytics"
    },
    // {
    //     name: "Team",
    //     image: team,
    //     value: "team"
    // },
    // {
    //     name: "Help",
    //     image: question,
    //     value: "help"
    // },
    // {
    //     name: "Profile",
    //     image: user,
    //     value: "profile"
    // },
    // {
    //     name: "Settings",
    //     image: setting,
    //     value: "settings"
    // },
    // {
    //     name: "Logout",
    //     image: logout,
    //     value: "logout"
    // },
]

export default sidebar