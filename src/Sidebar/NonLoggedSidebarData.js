import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from '@mui/icons-material/School';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import TableViewIcon from '@mui/icons-material/TableView';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export const NonLoggedSidebarData = [
  {
    title: "Login ",
    icon: <LockOpenIcon />,
    link: "/",
  },
  {
    title: "Instutitions",
    icon: <SchoolIcon />,
    link: "/instutitionsNonLogged",
  },
  {
    title: "Courses ",
    icon: <HistoryEduIcon />,
    link: "/coursesNonLogged",
  },
];