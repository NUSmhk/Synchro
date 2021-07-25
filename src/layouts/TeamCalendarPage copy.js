import React, { useState, useEffect } from "react";
import "react-big-calendar-like-google/lib/css/react-big-calendar.css";
import {
  makeStyles,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";

import { fire, db } from "../helpers/db";
import BigCalendar from "react-big-calendar-like-google";
import moment from "moment";
import firebase from "firebase";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import GroupIcon from "@material-ui/icons/Group";
import Toast from "../Components/Toast";
import { toast } from "react-toastify";
import CancelIcon from "@material-ui/icons/Cancel";
import {ValidationForm, TextValidator } from "react-material-ui-form-validator";
import {getCurrentUserProjects} from "../services/userServices"
import {addUserToProject, changeProjectInfo, getProjectUsers, removeUserFromProject} from "../services/projectServices"

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function TeamCalendarPage(props) {
  const classes = useStyles();
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [eventName, setEventName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [members, addMembers] = useState([{description: fire.auth().currentUser.email}]);
  const [newMember, addNewMember] = useState("");
  

  const [openImportCal, setOpenImportCal] = useState(false);
  const [openSlotAddEvent, setOpenSlotAddEvent] = useState(false);
  const [openMemberList, setOpenmemberList] = useState(false);
  const [projID, setProjID] = useState();
  const [openProjInfo, setOpenProjInfo] = useState(false);

  // Constants below to format date time for current date time of Add Event pop out
  const currMonth = (date) => {
    const month = date.getMonth() + 1;
    if (month < 10) {
      return "0" + month;
    } else {
      return month;
    }
  };

  const currDay = (date) => {
    const day = date.getDate();
    if (day < 10) {
      return "0" + day;
    } else {
      return day;
    }
  };

  const currHours = (date) => {
    const hours = date.getHours();
    if (hours < 10) {
      return "0" + hours;
    } else {
      return hours;
    }
  };

  const currMins = (date) => {
    const mins = date.getMinutes();
    if (mins < 10) {
      return "0" + mins;
    } else {
      return mins;
    }
  };

  const currDateTime =
    new Date().getFullYear() +
    "-" +
    currMonth(new Date()) +
    "-" +
    currDay(new Date()) +
    "T" +
    currHours(new Date()) +
    ":" +
    currMins(new Date());

  const inputDateTime = (date) =>
    new Date(date).getFullYear() +
    "-" +
    currMonth(new Date(date)) +
    "-" +
    currDay(new Date(date)) +
    "T" +
    currHours(new Date(date)) +
    ":" +
    currMins(new Date(date));

  const [datetime1, setDatetime1] = useState(currDateTime);
  const [datetime2, setDatetime2] = useState(currDateTime);
  const [slotDatetime1, setSlotDatetime1] = useState("");
  const [slotDatetime2, setSlotDatetime2] = useState("");

  const [event, setEvents] = useState([]);
  const [endOfProj, setEndOfProj] = useState(currDateTime);
  const [projName, setProjName] = useState("");

  const ical = require("cal-parser");

  const handleUpdate = () => {
    // To update current Calendar on page
    //test
    const user = fire.auth().currentUser;
    db.collection("users")
      .doc(user.uid)
      .collection("Events")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const fireEvent = doc.data().events;

          if (fireEvent !== undefined) {
            fireEvent.map((obj) => {
              obj.start = obj.start.toDate();
              obj.end = obj.end.toDate();
            });
            setEvents(fireEvent);
          }
        } else {
        }
      });
  };

  const handleEventName = (event) => {
    setEventName(event.target.value);
  };

  const handleDatetime1 = (event) => {
    setDatetime1(event.target.value);
  };

  const handleDatetime2 = (event) => {
    setDatetime2(event.target.value);
  };

  const handleClickOpenAddEvent = () => {
    // To open Add Event
    setOpenAddEvent(true);
  };

  const handleClickOpenImportCal = () => {
    // To close Import Cal
    setOpenImportCal(true);
  };

  const handleClickOpenSlotAddEvent = () => {
    // To open Add Event on clicked slot
    setOpenSlotAddEvent(true);
  };

  const handleClickOpenMemberList = () => {
    // To open Member List
    setOpenmemberList(true);
  }

  const handleClickOpenProjInfo = () => {
    // To Open Proj Info
    setOpenProjInfo(true);
  }
 
  function getRandomColor() {
    // Random colouring of events generated whenever an event is added
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleAddEvent = () => {
    // To add Event where it adds to database

    if (eventName === "") {
      toast.error("Please fill in the Event Name");
    } else if (datetime1 > datetime2) {
      toast.error("Please select valid timings");
    } else {
      const user = fire.auth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .collection("Events")
        .doc(user.uid)
        .update({
          events: firebase.firestore.FieldValue.arrayUnion({
            title: eventName,
            bgColor: getRandomColor(),
            start: new Date(datetime1),
            end: new Date(datetime2),
          }),
        });
      handleUpdate();
      handleCloseAddEvent();
    }
  };

  const handleCloseAddEvent = () => {
    // To close Add Event pop out
    setOpenAddEvent(false);
    setDatetime1(currDateTime);
    setDatetime2(currDateTime);
    setEventName("");
  };

  const handleCloseImportCal = () => {
    // To close Import Cal pop out
    setOpenImportCal(false);
    setSelectedFile(null);
  };

  const handleCloseSlotAddEvent = () => {
    setOpenSlotAddEvent(false);
    setDatetime1(currDateTime);
    setDatetime2(currDateTime);
    setEventName("");
  };
 
  const handleCloseMemberList = () => {
    setOpenmemberList(false);
    addNewMember("");
  }

  const handleCloseProjinfo = () => {
    setOpenProjInfo(false);
    setEndOfProj(currDateTime);
    setProjName("");
  }

  const handleNewMember = (event) => {
    addNewMember(event.target.value)
  }

  const handleEndOfProj = (event) => {
    setEndOfProj(event.target.value)
  }

  const handleProjName = (event) => {
    setProjName(event.target.value)
  }

  useEffect(() => {
    // To load Cal page using database everytime component refreshes/revisted
    handleUpdate();
    getCurrentUserProjects().then(result => {setProjID(result.projects[props.projIndex]._id); console.log(result.projects[props.projIndex].name);return (
      getProjectUsers(result.projects[props.projIndex]._id))}).then(result => { addMembers(result.map(mem => ({description: mem.email, uid: mem._id})));})
  }, []);

  const handleImport = (event) => {
    setSelectedFile(event.target.files[0]);
    const reader = new FileReader();

    reader.onload = () => {
      const parsed = ical.parseString(reader.result);
      console.log(parsed);
    };
    reader.readAsText(event.target.files[0]);
  };

  const handleUpload = () => {
    // When add Import Cal is clicked after selecting file
    const reader = new FileReader();
    const user = fire.auth().currentUser;

    reader.onload = () => {
      const parsed = ical.parseString(reader.result);
   

      parsed.events.map((e) => {
        if (e.hasOwnProperty("recurrenceRule")) {
          const rr = e.recurrenceRule;
          const times = rr._rrule[0].options.count;
          const exDate = rr._exdate;
          const exDateConverted = exDate.map((date) => date.toString());

          for (let i = 1; i < times; i++) {
            const startDate = new Date(e.dtstart.value);
            const endDate = new Date(e.dtend.value);
            startDate.setDate(startDate.getDate() + 7 * i);
            endDate.setDate(endDate.getDate() + 7 * i);

            const found = exDateConverted.find(
              (element) => element === startDate.toString()
            );

            if (found === undefined) {
              db.collection("users")
                .doc(user.uid)
                .collection("Events")
                .doc(user.uid)
                .update({
                  events: firebase.firestore.FieldValue.arrayUnion({
                    title: e.summary.value.toString(),
                    bgColor: getRandomColor(),
                    start: startDate,
                    end: endDate,
                  }),
                });
            }
          }
        } else {
          db.collection("users")
            .doc(user.uid)
            .collection("Events")
            .doc(user.uid)
            .update({
              events: firebase.firestore.FieldValue.arrayUnion({
                title: e.summary.value.toString(),
                bgColor: getRandomColor(),
                start: new Date(e.dtstart.value),
                end: new Date(e.dtend.value),
              }),
            });
        }
      });

      handleUpdate();
    };

    if (selectedFile === null || selectedFile.type !== "text/calendar") {
      toast.error("Please select a .ics file");
    } else {
      reader.readAsText(selectedFile);
      handleCloseImportCal();
    }
  };

  const removeMember = (member) => {
    const newMemberList = members.filter(mem => {
      return mem !== member;
    })

    addMembers(newMemberList)

  

    removeUserFromProject(member.uid, projID);


    toast.success("Member removed successfully!")
  }

  const handleUpdateProjName = () => {

    if (projName !== "") {

    changeProjectInfo(projID, {name: projName} ); 
    getCurrentUserProjects().then(result => {props.setProjTitle(result.projects[props.projIndex].name)});
    toast.success("Project Name changed successfully!");
    } else {
      toast.error("Please fill in a new Project Name")
    }

  }

  const handleUpdateProjEndDate = () => {
    
    changeProjectInfo(projID, {endDate: endOfProj })
    toast.success("End of Project changed successfully!")

  }

  const addEventDialog = (start, end, openDia, closeDia) => {
    return (
      <Dialog // Pop out for Add Event
        open={openDia}
        onClose={closeDia}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="event-name"
            label="Event Name"
            type="event"
            onChange={handleEventName}
          />
          <br></br>
          <TextField
            id="datetime-local"
            label="Event Start"
            type="datetime-local"
            defaultValue={start}
            className={classes.textField}
            onChange={handleDatetime1}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br></br>
          <TextField
            id="datetime-local"
            label="Event End"
            type="datetime-local"
            defaultValue={end}
            onChange={handleDatetime2}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br></br>

          <Grid
            container
            className={classes.buttons}
            spacing={3}
            justify="flex-end"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddEvent}
              >
                {" "}
                ADD EVENT{" "}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCloseAddEvent()}
              >
                {" "}
                CANCEL{" "}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  const projInfoDialog = () => {
      return (
        <Dialog // Pop out for Add Event
          open={openProjInfo}
          onClose={handleCloseProjinfo}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update Project Information</DialogTitle>
          <DialogContent style={{textAlign: 'center'}}>

          <TextField onChange={handleProjName} label="New Project Name" variant="outlined" />
          <br></br>
          <br></br>
          <Grid item >
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProjName}
                  fullWidth

                >
                  {" "}
                  UPDATE PROJECT NAME{" "}
                </Button>

              </Grid>
          <br></br>
          <TextField
            id="datetime-local"
            label="End of Project"
            type="datetime-local"
            defaultValue={currDateTime}
            className={classes.textField}
            onChange={handleEndOfProj}
            InputLabelProps={{
              shrink: true,
            }}
          />
  
             <br></br>
             <br></br>
              <Grid item>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProjEndDate}
                  fullWidth
                >
                  {" "}
                  UPDATE END OF PROJECT{" "}
                </Button>
              </Grid>
     
          </DialogContent>
        </Dialog>
      );
    };

  const importCalDialog = () => {
    return (
      <Dialog
        open={openImportCal}
        onClose={handleCloseImportCal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Import an ics file</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleImport}></input>{" "}
          {/* will setFile to first in array */}
          <Grid
            container
            className={classes.buttons}
            spacing={3}
            justify="flex-end"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
              >
                {" "}
                IMPORT CALENDAR{" "}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCloseImportCal()}
              >
                {" "}
                CANCEL{" "}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

    const handleAddMembers = () => {

    //error handling for members, need to add checks for existence of members
    if (newMember === "") {
      toast.error(
        "Please fill in Email of a Group Member that you want to add"
      );
    } else {
    //  console.log(addUserToProject(newMember, projID).then(response => { addMembers([
    //     ...members,
    //     {
    //       description: newMember,
    //     },
    //   ])}).catch(e => {
    //     toast.error(e.message);
    //     console.log("ERROR")
    //   }))

      
       addUserToProject(newMember, projID).then(
       (result) => {

        addMembers([
          ...members,
          {
            description: newMember,
          },
        ]);
        toast.success("Member added successfully!")
       }, 
       (error) => {
        toast.error(error.message);
       }

       )
      

    }
  };

  const memberListDialog = () => {
    return (
      <Dialog // Pop out for Add Event
        open={openMemberList}
        onClose={handleCloseMemberList}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Project Group Members</DialogTitle>
        <DialogContent>
        
          <br></br>
           <Grid container justify="flex-left">
    
      
                <Grid item lg={11}>

                <TextField onChange={handleNewMember} label="Member's Email" variant="outlined" />
                 
                </Grid>
                <Grid item lg={1}>
                  <IconButton
    
                    variant="contained"
                    color="primary"
                    style={{ height: 55, width: 50 }}
                    onClick={handleAddMembers}
                  >
                    <AddCircleIcon></AddCircleIcon>
                  </IconButton>
                </Grid>
   
            </Grid>

              <br></br>
              <Typography align="center"> Member List:</Typography>
              <br></br>

              <List>
              {members.map((member, index) => (
                  <ListItem divider alignItems="flex-start">
                    <ListItemIcon>
                      <GroupIcon></GroupIcon>
                    </ListItemIcon>
                    <ListItemText>
                      <td>{index + 1 + ". "} </td>
                      <td>{member.description}</td>
                    </ListItemText>
                    <td>
                    {index !== 0 ?
                  <IconButton color="secondary" onClick={(e) => removeMember(member)}>
                    <CancelIcon></CancelIcon>
                    </IconButton>
                    : ""
                      }
                    </td>

                  </ListItem>
                  
                ))}
              </List>

    
          
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <Toast position="top-center"></Toast>
      {addEventDialog(
        currDateTime,
        currDateTime,
        openAddEvent,
        handleCloseAddEvent
      )}
      {addEventDialog(
        inputDateTime(slotDatetime1),
        inputDateTime(slotDatetime2),
        openSlotAddEvent,
        handleCloseSlotAddEvent
      )}
      

      <Grid
        container
        className={classes.buttons}
        spacing={3}
        justify="flex-end"
      >

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenProjInfo}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Update Project{" "}
          </Button>

          {projInfoDialog()}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenMemberList}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Member List{" "}
          </Button>

          {memberListDialog()}
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpenAddEvent}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Add Event{" "}
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component="label"
            startIcon={<CalendarTodayIcon />}
            onClick={handleClickOpenImportCal}
          >
            {" "}
            Import Calendar{" "}
          </Button>

          {importCalDialog()}
        </Grid>
      </Grid>

      <Paper className={classes.paper}>
        <BigCalendar
          selectable
          events={event}
          defaultView="week"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={(event) => alert(event.title)}
          onSelectSlot={
            (slotInfo) => {
              setSlotDatetime1(slotInfo.start);
              setSlotDatetime2(slotInfo.end);

        

              handleClickOpenSlotAddEvent();
            }

            // (slotInfo) =>
            // alert(
            //   `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            //     `\nend: ${slotInfo.end.toLocaleString()}` +
            //     `\naction: ${slotInfo.action}`
            // )
          }
        ></BigCalendar>
      </Paper>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 500,
  },

  buttons: {
    padding: theme.spacing(1),
  },
}));

export default TeamCalendarPage;
