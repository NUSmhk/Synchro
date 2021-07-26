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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";

import { fire } from "../helpers/db";
import BigCalendar from "react-big-calendar-like-google";
import moment from "moment";

import AddToQueueIcon from "@material-ui/icons/AddToQueue";

import GroupIcon from "@material-ui/icons/Group";
import Toast from "../Components/Toast";
import { toast } from "react-toastify";

import { getCurrentUserProjects, getUserInfo } from "../services/userServices";
import {
  addUserToProject,
  getProjectEvents,
  getProjectUsers,
  removeUserFromProject,
} from "../services/projectServices";
import MyProjects from "./MyProjects";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function TeamCalendarPageNM(props) {
  const [updater, setUpdater] = useState(0);
  const classes = useStyles();

  const [members, addMembers] = useState([
    { description: fire.auth().currentUser.email },
  ]);
  const [newMember, addNewMember] = useState("");

  const [openMemberList, setOpenmemberList] = useState(false);
  const [openProjInfo, setOpenProjInfo] = useState(false);
  const [projID, setProjID] = useState();
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const [event, setEvents] = useState([
    { mergedEvents: [], projectEvents: [] },
  ]);

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const updateCal = (ID) => {
    // To update current Calendar on page
    //test\

    getProjectEvents(ID)
      .then((result) => {
        console.log(result);
        const redEvents = result.mergedEvents.map((eachEvent) => ({
          title: "Unavailable Slot",
          bgColor: "#FF0000",
          start: new Date(eachEvent.start),
          end: new Date(eachEvent.end),
          id: eachEvent._id,
          teamEvent: false,
        }));

        const teamEvents = result.projectEvents.map((eachEvent) => ({
          title: eachEvent.title,
          bgColor: "#00FF00",
          start: new Date(eachEvent.start),
          end: new Date(eachEvent.end),
          id: eachEvent._id,
          teamEvent: true,
        }));

        return redEvents.concat(teamEvents);
      })
      .then((result) => {
        setEvents(result);
      });
  };

  const handleUpdateCal = () => {
    setUpdater(updater + 1);
  };

  const handleClickOpenMemberList = () => {
    // To open Member List
    setOpenmemberList(true);
    handleUpdateCal();
    console.log(members);
  };

  const handleClickOpenProjInfo = () => {
    // To Open Proj Info
    handleUpdateCal();
    setOpenProjInfo(true);
  };

  const handleCloseMemberList = () => {
    setOpenmemberList(false);
    addNewMember("");
  };

  const handleCloseProjinfo = () => {
    setOpenProjInfo(false);
  };

  useEffect(() => {
    // To load Cal page using database everytime component refreshes/revisted
    getCurrentUserProjects()
      .then((result) => {
        setProjID(result.projects[props.projIndex]._id);

        updateCal(result.projects[props.projIndex]._id);
        return getProjectUsers(result.projects[props.projIndex]._id);
      })
      .then((result) => {
        addMembers(
          result.map((mem) => ({
            email: mem.email,
            uid: mem._id,
            name: mem.displayName,
          }))
        );
      });
  }, []);

  useDidMountEffect(() => {
    updateCal(projID);
  }, [updater]);

 


  const memberListDialog = () => {


    return (
      <Dialog // Pop out for Add Event
        open={openMemberList}
        onClose={handleCloseMemberList}
        aria-labelledby="form-dialog-title"
        style={{ textAlign: "center" }}
      >
        <DialogTitle id="form-dialog-title">Project Group Members</DialogTitle>
        <DialogContent>
          <br></br>
          <Typography> Member List:</Typography>
          <br></br>

          <List>
            {members.map((member, index) => (
              <ListItem divider alignItems="flex-start">
                <ListItemIcon>
                  <GroupIcon></GroupIcon>
                </ListItemIcon>
                <ListItemText>
                  <td>{index + 1 + ". "} </td>
                  <td>{member.email + " "}</td>
                  <td>{"(" + member.name + ")"}</td>
                </ListItemText>
              </ListItem>
            ))}
          </List>
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
        style={{ textAlign: "center" }}
      >
        <DialogTitle id="form-dialog-title">Project Information</DialogTitle>
        <DialogContent>
          <td>{"Project Name: " + props.projName} </td>
          {"Project End: " + new Date(props.projEndDate).toString()}
        </DialogContent>
      </Dialog>
    );
  };

  const handleClickOpenConfirmation = () => {
        setOpenConfirmation(true);
  };

  const ConfirmationDialog = () => {
    const handleCloseConfirmation = () => {
      setOpenConfirmation(false);
    };

    const handleQuit = () => {

     getUserInfo(fire.auth().currentUser.uid).then((result) => {

        removeUserFromProject(result._id, projID).then((result) => {

          props.setQuitPage(<MyProjects/>)
        })
     })
    };

    return (
      <Dialog 
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Confirm Quit Team?
        </DialogTitle>
        <DialogContent>
          <Typography></Typography>

          <Grid
            container
            className={classes.buttons}
            spacing={6}
            justify="center"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleQuit()}
              >
                {" "}
                YES{" "}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleCloseConfirmation()}
              >
                {" "}
                NO{" "}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {projInfoDialog()}
      {memberListDialog()}
      {ConfirmationDialog()}

      <Toast position="top-center"></Toast>
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
            onClick={() => handleClickOpenProjInfo()}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Project Information{" "}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickOpenMemberList()}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Member List{" "}
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickOpenConfirmation()}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Quit Team{" "}
          </Button>
        </Grid>
      </Grid>

      <Paper className={classes.paper}>
        <BigCalendar
          showMultiDayTimes={true}
          selectable
          events={event}
          defaultView="week"
          scrollToTime={new Date(2000, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={(event) => {
            toast.error("Cannot modify Team Calendar events!");
          }}
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

export default TeamCalendarPageNM;
