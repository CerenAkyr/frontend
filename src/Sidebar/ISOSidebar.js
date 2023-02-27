import React from "react";
import "./Sidebar.css";
import { ISOSidebarData } from "./ISOSidebarData";
import { useState, useEffect } from "react";
import LogoutButton from "../Login/LogoutButton";

function ISOSidebar() {
  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {ISOSidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          );
        })}
        <LogoutButton />
      </ul>
    </div>
  );
}

export default ISOSidebar;
