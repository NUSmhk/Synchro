import React, { useState, useEffect, useRef } from "react";
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
} from "@material-ui/core";

import { fire, db } from "../helpers/db";
import BigCalendar from "react-big-calendar-like-google";
import moment from "moment";
import firebase from "firebase";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Toast from "../Components/Toast";
import { toast } from "react-toastify";
import {
  addNewEventToCurrentUser,
  deleteUserEvent,
  getCurrentUserEvents,
  getCurrentUserProjects,
  modifyUserEvent,
} from "../services/userServices";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function CalendarPage(props) {
  const classes = useStyles();
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [eventName, setEventName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [openSlotAddEvent, setOpenSlotAddEvent] = useState(false);
  const [openModifyEvent, setOpenModifyEvent] = useState(false);
  const [openImportCal, setOpenImportCal] = useState(false);

  const [currEvent, setCurrEvent] = useState({});
  const [updater, setUpdater] = useState(0);

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
  const [newDateTime1, setNewDateTime1] = useState("");
  const [newDateTime2, setNewDateTime2] = useState("");

  const [event, setEvents] = useState([]);

  const ical = require("cal-parser");

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

  const handleClickOpenModifyEvent = () => {
    // To open Modify event option after clicking on existing event
    setOpenModifyEvent(true);
  };

  const handleUpdateCal = () => {
    setUpdater(updater + 1);
  }

  const updateCal = () => {
    getCurrentUserEvents().then((result) => {
      setEvents(
        result.events.map((eachEvent) => ({
          title: eachEvent.title,
          bgColor: "#0000FF",
          start: new Date(eachEvent.start),
          end: new Date(eachEvent.end),
          id: eachEvent._id,
        }))
      );
    });
  };

  const handleAddSlotEvent = () => {
    if (eventName === "") {
      toast.error("Please fill in the Event Name");
    } else {
      addNewEventToCurrentUser({
        title: eventName,
        start: new Date(slotDatetime1),
        end: new Date(slotDatetime2),
      }).then(result => handleUpdateCal())
      toast.success("Event added successfully!")
 
      handleCloseSlotAddEvent();
    }
  };

  const handleAddEvent = () => {
    // To add Event where it adds to database

    if (eventName === "") {
      toast.error("Please fill in the Event Name");
    } else if (datetime1 > datetime2) {
      toast.error("Please select valid timings");
    } else {
      addNewEventToCurrentUser({
        title: eventName,
        start: new Date(datetime1),
        end: new Date(datetime2),
      }).then(result => handleUpdateCal())
      toast.success("Event added successfully!")
      
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

  const handleCloseSlotAddEvent = () => {
    setOpenSlotAddEvent(false);
    setDatetime1(currDateTime);
    setDatetime2(currDateTime);
    setEventName("");
  };

  const AddEventDialog = (start, end, openDia, closeDia, handleAdd) => {
    const handleEventName = (event) => {
      setEventName(event.target.value);
    };

    const handleDatetime1 = (event) => {
      setDatetime1(event.target.value);
    };

    const handleDatetime2 = (event) => {
      setDatetime2(event.target.value);
    };

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
            justify="center"
          >
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleAdd}>
                {" "}
                ADD EVENT{" "}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={closeDia}>
                {" "}
                CANCEL{" "}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  const ImportCalDialog = () => {
    const handleCloseImportCal = () => {
      // To close Import Cal pop out
      setOpenImportCal(false);
      setSelectedFile(null);
    };

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

      function getRandomColor() {
        // Random colouring of events generated whenever an event is added
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      reader.onload = () => {
        const parsed = ical.parseString(reader.result);
        console.log(parsed);

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

        // handleUpdate();
      };

      if (selectedFile === null || selectedFile.type !== "text/calendar") {
        toast.error("Please select a .ics file");
      } else {
        reader.readAsText(selectedFile);
        handleCloseImportCal();
      }
    };

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
            justify="center"
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

  const ModifyEventDialog = () => {
    const [newEventName, setNewEventName] = useState("");

    const handleNewEventName = (event) => {
      setNewEventName(event.target.value);
    };

    const handleNewDateTime1 = (event) => {
      setNewDateTime1(event.target.value);
    };

    const handleNewDateTime2 = (event) => {
      setNewDateTime2(event.target.value);
    };

    const handleCloseModifyEvent = () => {
      setOpenModifyEvent(false);
    };

    const handleUpdateEventName = () => {
      if (newEventName !== "") {
        modifyUserEvent({ title: newEventName }, currEvent).then((result) =>
          handleUpdateCal()
        );
        toast.success("Event Name updated successfully!")
        handleCloseModifyEvent();
      } else {
        toast.error("Please fill in the New Event Name");
      }
    };

    const handleUpdateStartEnd = () => {
      if (newDateTime1 > newDateTime2) {
        toast.error("Please select valid timings");
      } else {
        modifyUserEvent(
          { start: newDateTime1, end: newDateTime2 },
          currEvent
        ).then((result) =>
          handleUpdateCal()
        );
        toast.success("Event duration updated successfully!")
        handleCloseModifyEvent();
      }
    };

    const handleDeleteEvent = () => {
      deleteUserEvent(currEvent).then((result) =>
       handleUpdateCal()

      );

      toast.success("Event successfully deleted!")
      handleCloseModifyEvent();
    };

    return (
      <Dialog // Pop out for Add Event
        open={openModifyEvent}
        onClose={handleCloseModifyEvent}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Modify Current Event</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <TextField
            label="New Project Name"
            variant="outlined"
            onChange={handleNewEventName}
          />
          <br></br>
          <br></br>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateEventName}
              fullWidth
            >
              {" "}
              UPDATE EVENT NAME{" "}
            </Button>
          </Grid>
          <br></br>
          <TextField
            id="datetime-local"
            label="New Event Start"
            type="datetime-local"
            defaultValue={inputDateTime(newDateTime1)}
            className={classes.textField}
            onChange={handleNewDateTime1}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br></br>
          <TextField
            id="datetime-local"
            label="New Event End"
            type="datetime-local"
            defaultValue={inputDateTime(newDateTime2)}
            className={classes.textField}
            onChange={handleNewDateTime2}
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
              onClick={handleUpdateStartEnd}
              fullWidth
            >
              {" "}
              UPDATE DURATION OF EVENT{" "}
            </Button>
          </Grid>
          <br></br>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteEvent}
            fullWidth
          >
            {" "}
            DELETE CURRENT EVENT{" "}
          </Button>
        </DialogContent>
      </Dialog>
    
    );
  };

  useEffect(() => {
    updateCal();
    console.log("updated")
  }, [updater]);

  

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <Toast position="top-center"></Toast>
      {AddEventDialog(
        currDateTime,
        currDateTime,
        openAddEvent,
        handleCloseAddEvent,
        handleAddEvent
      )}
      {AddEventDialog(
        inputDateTime(slotDatetime1),
        inputDateTime(slotDatetime2),
        openSlotAddEvent,
        handleCloseSlotAddEvent,
        handleAddSlotEvent
      )}
      {/* {importCalDialog} */}

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
            onClick={updateCal}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Refresh{" "}
          </Button>
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

          {ImportCalDialog()}
        </Grid>
      </Grid>

      <Paper className={classes.paper}>
        {ModifyEventDialog()}

        <BigCalendar
        showMultiDayTimes={true}
          selectable
          events={event}
          defaultView="week"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={(event) => {
            console.log(event);
            setNewDateTime1(event.start);
            setNewDateTime2(event.end);
            setCurrEvent(event.id);
            handleClickOpenModifyEvent();
          }}
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

export default CalendarPage;
