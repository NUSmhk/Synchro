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
} from "@material-ui/core";

import { fire, db } from "../helpers/db";
import BigCalendar from "react-big-calendar-like-google";
import moment from "moment";
import firebase from "firebase";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import Toast from "../Components/Toast";
import { toast } from "react-toastify";
import DatePicker from "material-ui/DatePicker";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function CalendarPage() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [open1, setOpen1] = useState(false);

  // Constants below to format date time for current date time of Add Event pop out
  const currMonth = () => {
    const month = new Date().getMonth() + 1;
    if (month < 10) {
      return "0" + month;
    } else {
      return month;
    }
  };

  const currDate = () => {
    const date = new Date().getDate();
    if (date < 10) {
      return "0" + date;
    } else {
      return date;
    }
  };

  const currHours = () => {
    const hours = new Date().getHours();
    if (hours < 10) {
      return "0" + hours;
    } else {
      return hours;
    }
  };

  const currMins = () => {
    const mins = new Date().getMinutes();
    if (mins < 10) {
      return "0" + mins;
    } else {
      return mins;
    }
  };

  const currDateTime =
    new Date().getFullYear() +
    "-" +
    currMonth() +
    "-" +
    currDate() +
    "T" +
    currHours() +
    ":" +
    currMins();

  const [datetime1, setDatetime1] = useState(currDateTime);
  const [datetime2, setDatetime2] = useState(currDateTime);

  const [event, setEvents] = useState([]);

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

  const handleClickOpen = () => {
    // To open Add Event
    setOpen(true);
  };

  const handleClickOpen1 = () => {
    // To close Import Cal
    setOpen1(true);
  };

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
      handleClose();
    }
  };

  const handleClose = () => {
    // To close Add Event pop out
    setOpen(false);
    setDatetime1(currDateTime);
    setDatetime2(currDateTime);
    setEventName("");
  };

  const handleClose1 = () => {
    // To close Import Cal pop out
    setOpen1(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    // To load Cal page using database everytime component refreshes/revisted
    handleUpdate();
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
      console.log(parsed);

      parsed.events.map((e) => {
        if (e.hasOwnProperty("recurrenceRule")) {
          const rr = e.recurrenceRule;
          const times = rr._rrule[0].options.count;
          const exDate = rr._exdate;
          const exDateConverted = exDate.map((date) => date.toString())

          for (let i = 1; i < times; i++) {
            const startDate = new Date(e.dtstart.value);
            const endDate = new Date(e.dtend.value);
            startDate.setDate(startDate.getDate() + 7 * i);
            endDate.setDate(endDate.getDate() + 7 * i);
      

            const found = exDateConverted.find((element) => element === startDate.toString());
            console.log(typeof startDate)
            console.log(typeof exDate[0])
            console.log(found)


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
      handleClose1();
    }
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <Toast position="top-center"></Toast>
      <Dialog // Pop out for Add Event
        open={open}
        onClose={handleClose}
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
            defaultValue={currDateTime}
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
            defaultValue={currDateTime}
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
                onClick={() => handleClose()}
              >
                {" "}
                CANCEL{" "}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

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
            onClick={handleClickOpen}
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
            onClick={handleClickOpen1}
          >
            {" "}
            Import Calendar{" "}
          </Button>

          <Dialog
            open={open1}
            onClose={handleClose1}
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
                    onClick={() => handleClose1()}
                  >
                    {" "}
                    CANCEL{" "}
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
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
          onSelectSlot={(slotInfo) =>
            alert(
              `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                `\nend: ${slotInfo.end.toLocaleString()}` +
                `\naction: ${slotInfo.action}`
            )
          }
        ></BigCalendar>
        {/* <p>
          {selectedFile ? (
            <div>
              <p>File Name: {selectedFile.name}</p>
              <p>File Type: {selectedFile.type}</p>
              {testOutput}
            </div>
          ) : (
            <div>
              <p> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA </p>
              <p> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA </p>
              <p> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA </p>
              <p> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA </p>
            </div>
          )}
        </p> */}
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
