import React, { useState, useEffect } from "react";
import clsx from "clsx";
import "react-big-calendar-like-google/lib/css/react-big-calendar.css";
import {
  makeStyles,
  CssBaseline,
  Drawer,
  AppBar,
  Button,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MainListItems from "./lisItems";
import Calendar from "react-calendar";
import {fire, db} from "../helpers/db";
import BigCalendar from "react-big-calendar-like-google";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function CalendarPage() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [event, setEvents] = useState([])
  
  const [eventName, setEventName] = useState("")
  const [datetime1, setDatetime1] = useState("")
  const [datetime2, setDatetime2] = useState("")

 

  const handleEventName = (event) => {
    setEventName(event.target.value)
  }

  const handleDatetime1 = (event) => {
    setDatetime1(event.target.value)
  }

  const handleDatetime2 = (event) => {
    setDatetime2(event.target.value)
  }


  const handleClickOpen = () => {
    setOpen(true);

 
    
    // db.collection("users").doc("user1").get().then((doc) => {
    //   console.log("data:", doc.data().Name)
    // })
  }
  
  const handleAddEvent = () => {

    // db.collection("users").doc(user.uid).collection("Events").doc(user.uid).set({
    //   events: [...event,{
    //     title: eventName,
    //     bgColor: "#b0e0e6",
    //     start: new Date(datetime1),
    //     end: new Date(datetime2)
    //   }]
    // })

    setEvents([...event,{
      title: eventName,
      bgColor: "#b0e0e6",
      start: new Date(datetime1),
      end: new Date(datetime2)
    }] )  
  }
  

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   const handleUpdate = () => { //test
  //     const user = fire.auth().currentUser;
  //     db.collection("users").doc(user.uid).collection("Events").doc(user.uid).get().then((doc) => {

  //       if (doc.exists) {
  //         setEvents(doc.data().events);
  //         } else {
  
  //         }      
  //     })
  //   }
  //   handleUpdate();
  // }, []);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <Grid
        container
        className={classes.buttons}
        spacing={3}
        justify="flex-end"
      >
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            {" "}
            Add Event{" "}
          </Button>
        </Grid>

        <Dialog
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
              defaultValue={new Date().now}
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
              defaultValue={new Date().now}
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
                <Button variant="contained" color="primary" onClick={handleAddEvent}>
                  {" "}
                  ADD EVENT{" "}
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => handleClose()}>
                  {" "}
                  CANCEL{" "}
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        <Grid item>
          <Button variant="contained" color="primary">
            {" "}
            Import Calendar{" "}
          </Button>
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
          // onSelectSlot={(slotInfo) =>
          //   alert(
          //     `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
          //       `\nend: ${slotInfo.end.toLocaleString()}` +
          //       `\naction: ${slotInfo.action}`
          //   )
          // }
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
