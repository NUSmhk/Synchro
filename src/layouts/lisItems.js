import {React, useState} from "react";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ListIcon from '@material-ui/icons/List';
import {ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import Profile from "./Profile";
import CalendarPage from "./CalendarPage";
import CreateNewProject from "./CreateNewProject";




function MainListItems(props) {

  const [selected, setSelected] = useState(2);
  
  return( <div>
    <MenuItem button onClick={() => {setSelected(1); props.setPages(<Profile/>); props.setTitles("Profile")}} selected={selected === 1}>

    <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </MenuItem>


    <MenuItem button onClick={() => {setSelected(2); props.setPages(<CalendarPage/>); props.setTitles("My Calendar")}} selected={selected === 2}>
    <ListItemIcon>
        <CalendarTodayIcon />
      </ListItemIcon>
      <ListItemText primary="My Calendar" />
      </MenuItem>

      <MenuItem button onClick={() => {setSelected(3); props.setPages(<CreateNewProject/>); props.setTitles("Create New Project")}} selected={selected === 3}>
    <ListItemIcon>
        <AddToQueueIcon />
      </ListItemIcon>
      <ListItemText primary="Create New Project" />
      </MenuItem>

    <MenuItem button onClick={() => setSelected(4)} selected={selected === 4}>
    <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText primary="My Projects" />
      </MenuItem>
  </div>)
};

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
