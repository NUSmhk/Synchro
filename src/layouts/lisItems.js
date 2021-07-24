import { React, useState } from "react";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ListIcon from "@material-ui/icons/List";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import Profile from "./Profile";
import CalendarPage from "./CalendarPage";
import CreateNewProject from "./CreateNewProject";
import MyProjects from "./MyProjects";
import { fire, db } from "../helpers/db";
import firebase from "firebase";
import {addNewProjectToCurrentUser} from "../services/userServices"


function MainListItems(props) {
  const user = fire.auth().currentUser;
  //State used to set different pages (components) when buttons on left bar are clicked
  const [selected, setSelected] = useState(2);

  //Passed down as props to CreateNewProject, to store title in firestore
  const handleProjTitle = (title, endDate) => {
    db.collection("users")
      .doc(user.uid)
      .collection("projects")
      .doc(user.uid)
      .update({
        proj: firebase.firestore.FieldValue.arrayUnion({ description: title }),
      });

     addNewProjectToCurrentUser({
              name: title,
              endDate: endDate,
          })

    //  createProject(title, endDate)

  };

  const setTeamPage = (page) => {
    props.setPages(page)
  }

  const setTeamTitle = (title) => {
  props.setTitles(title)
  }

  const setPage = (page) => {
    props.setPages(page)
  }

  return (
    <div>
      <MenuItem
        button
        onClick={() => {
          setSelected(1);
          props.setPages(<Profile />);
          props.setTitles("Profile");
        }}
        selected={selected === 1}
      >
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>

      <MenuItem
        button
        onClick={() => {
          setSelected(2);
          props.setPages(<CalendarPage setPage={setPage} />);
          props.setTitles("My Calendar");
        }}
        selected={selected === 2}
      >
        <ListItemIcon>
          <CalendarTodayIcon />
        </ListItemIcon>
        <ListItemText primary="My Calendar" />
      </MenuItem>

      <MenuItem
        button
        onClick={() => {
          setSelected(4);
          props.setPages(<MyProjects setTeamPages={setTeamPage} setTeamTitles={setTeamTitle}/>);
          props.setTitles("My Projects");
        }}
        selected={selected === 4}
      >
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="My Projects" />
      </MenuItem>

      <MenuItem
        button
        onClick={() => {
          setSelected(3);
          props.setPages(<CreateNewProject setProjTitle={handleProjTitle} />);
          props.setTitles("Create New Project");
        }}
        selected={selected === 3}
      >
        <ListItemIcon>
          <AddToQueueIcon />
        </ListItemIcon>
        <ListItemText primary="Create New Project" />
      </MenuItem>
    </div>
  );
}

export default MainListItems;
