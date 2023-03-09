import React from "react";
import "./sidebar.scss";
import { textIcon, mainIcon } from "../../assets";
import SidebarMenu from "../../../data/SidebarMenu";

const Sidebar = ({ setDisplayComponent, displayComponent }) => {
  const showFullSidebar = () => {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
  };

  const hideFullSidebar = () => {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
  };
  return (
    <div
      className="app__sidebar"
      id="sidebar"
      onMouseOver={() => {
        showFullSidebar();
      }}
      onMouseOut={() => {
        hideFullSidebar();
      }}
    >
      <div className="app__sidebar__header">
        <img src={mainIcon} alt="" className="small__icon" />
        <img src={textIcon} alt="" className="header__icon" />
      </div>
      <div className="app__sidebar__links">
        <ul>
          {SidebarMenu.map((menu) => {
            return (
              <li
                onClick={() => {
                  setDisplayComponent(`${menu.value}`);
                }}
                key={menu.name}
                className={`${displayComponent === menu.value ? "active" : ""}`}
              >
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="extra__small"
                />
                <span>{menu.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
