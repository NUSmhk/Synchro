import React from "react";
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
  Paper
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import  MainListItems from "./lisItems";
import Calendar from "react-calendar";
import CalEvents from "./CalEvents";
import BigCalendar from "react-big-calendar-like-google";
import moment from "moment";


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));


function CalendarPage() {


  const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    

return(
<main className={classes.content}>
        <div className={classes.appBarSpacer} />


<Grid container >

<Grid item xs={8} >

   </Grid>



   <Grid item  xs={2} >
   <Button variant="contained" color="primary"> Add Event </Button>
   </Grid>

   <Grid item  xs={2}>
   <Button variant="contained" color="primary"> Import Calendar </Button>
   </Grid>
 
</Grid>
   
              <Paper className={classes.paper} >
                 <BigCalendar selectable
          events={CalEvents()}
          defaultView="week"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={slotInfo =>
            alert(
              `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                `\nend: ${slotInfo.end.toLocaleString()}` +
                `\naction: ${slotInfo.action}`
            )
          }></BigCalendar>
              </Paper>

           
      </main>
)
}


const drawerWidth = 240;

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
  }));


  export default CalendarPage;