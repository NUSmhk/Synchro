import { React, useState, useEffect } from "react";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ListIcon from "@material-ui/icons/List";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import Profile from "./Profile";
import CalendarPage from "./CalendarPage";
import CreateNewProject from "./CreateNewProject";
import MyProjects from "./MyProjects";
import {fire, db} from "../helpers/db";
import { Component } from "react";

function MainListItems(props) {

  const user = fire.auth().currentUser;

  const [selected, setSelected] = useState(2);
  // const [projTitle, setProjTitle] = useState([{description: "Project 1"}])
  const [projTitle, setProjTitle] = useState([])

  const handleProjTitle = (title) => {

 
    db.collection("users").doc(user.uid).collection("projects").doc(user.uid).set({
      proj: [...projTitle, {
        description: title
      }]
    })

    setProjTitle([...projTitle, {
      description: title
    }])

    // db.collection("users").doc(user.uid).collection("projects").doc(user.uid).get().then((doc) => {
    // setProjTitle(doc.data().proj)
    // })
  }

 
  useEffect(() => {
    const handleUpdate = () => { //test
      const user = fire.auth().currentUser;
      db.collection("users").doc(user.id).collection("projects").doc(user.ui).get().then((doc) => {

        if (doc.exists) {
        setProjTitle(doc.data().proj);
        console.log(doc.data().proj)
        console.log(projTitle)
        } else {

        }
      })
    }
    handleUpdate();
  }, []);

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
          props.setPages(<CalendarPage />);
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

      <MenuItem
        button
        onClick={() => {
          setSelected(4);
          props.setPages(<MyProjects projTitle={projTitle}/>);
          props.setTitles("My Projects");
        }}
        selected={selected === 4}
      >
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="My Projects" />
      </MenuItem>
    </div>
  );
}

export default MainListItems;

// export const secondaryListItems = (
//   <div>
//     <div>
//       <ListItem button>
//         <ListItemText primary="Log out" />
//       </ListItem>
//     </div>
//   </div>
// );
