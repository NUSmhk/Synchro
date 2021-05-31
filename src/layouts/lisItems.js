import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";




export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="My Calendar" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Create New Team Calendar" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Team Calendars" />
    </ListItem>
  </div>
);

// export const secondaryListItems = (
//   <div>
//     <div>
//       <ListItem button>
//         <ListItemText primary="Log out" />
//       </ListItem>
//     </div>
//   </div>
// );
