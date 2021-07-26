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
  IconButton,
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
import AddCircleIcon from "@material-ui/icons/AddCircle";
import GroupIcon from "@material-ui/icons/Group";
import Toast from "../Components/Toast";
import { toast } from "react-toastify";
import CancelIcon from "@material-ui/icons/Cancel";
import { getCurrentUserProjects } from "../services/userServices";
import {
  addNewEventToProject,
  addUserToProject,
  changeProjectInfo,
  getProjectEvents,
  getProjectUsers,
  removeUserFromProject,
  modifyProjectEvent,
  deleteProjectEvent,
} from "../services/projectServices";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function TeamCalendarPage(props) {
  const [updater, setUpdater] = useState(0);
  const classes = useStyles();
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [eventName, setEventName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, addMembers] = useState([
    { description: fire.auth().currentUser.email },
  ]);
  const [newMember, addNewMember] = useState("");
  const [currEvent, setCurrEvent] = useState({});

  const [openSlotAddEvent, setOpenSlotAddEvent] = useState(false);
  const [openMemberList, setOpenmemberList] = useState(false);
  const [projID, setProjID] = useState();
  const [openProjInfo, setOpenProjInfo] = useState(false);
  const [openModifyEvent, setOpenModifyEvent] = useState(false);

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

  const [event, setEvents] = useState([
    { mergedEvents: [], projectEvents: [] },
  ]);
  const [endOfProj, setEndOfProj] = useState(currDateTime);
  const [projName, setProjName] = useState("");

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const handleClickOpenSlotAddEvent = (start, end) => {
    // To open Add Event on clicked slot

    var clashing = false;
    getProjectEvents(projID).then((result) => {
      result.mergedEvents
        .map((eachEvent) => ({
          start: new Date(eachEvent.start),
          end: new Date(eachEvent.end),
        }))
        .map((eachEvent) => {
          if (
            (eachEvent.start < start && eachEvent.end > start) ||
            (eachEvent.start < end && eachEvent.end > end) ||
            (eachEvent.start >= start && eachEvent.end <= end)
          ) {
            clashing = true;
          }
        });

       if (new Date(start) >= new Date(endDate)) {
        toast.error("Please select starting time to be before Project End")
       } else if (clashing) {
        toast.error("Cannot add Team Event that clashes with Blocked Events!");
      } else {
        setOpenSlotAddEvent(true);
      }
    });
  };

  const handleAddSlotEvent = () => {
    var clashing = false;
    getProjectEvents(projID).then((result) => {
      result.mergedEvents
        .map((eachEvent) => ({
          start: new Date(eachEvent.start),
          end: new Date(eachEvent.end),
        }))
        .map((eachEvent) => {
          const start = new Date(slotDatetime1);
          const end = new Date(slotDatetime2);
          if (
            (eachEvent.start < start && eachEvent.end > start) ||
            (eachEvent.start < end && eachEvent.end > end) ||
            (eachEvent.start >= start && eachEvent.end <= end)
          ) {
            clashing = true;
          }
        });

      if (eventName === "") {
        toast.error("Please fill in the Team Event Name");
      } else if (new Date(slotDatetime1) >= new Date(slotDatetime2)) {
        toast.error("Please select valid timings");
      
      } else if (clashing) {
        toast.error("Cannot add Team Event that clashes with Blocked Events!");
        handleCloseSlotAddEvent();
        handleUpdateCal();
      } else {
        addNewEventToProject(
          {
            title: eventName,
            start: new Date(slotDatetime1),
            end: new Date(slotDatetime2),
          },
          projID
        ).then((result) => {
          handleUpdateCal();
          toast.success("Team Event added successfully!");
          handleCloseSlotAddEvent();
        });
      }
    });
  };

  const updateCal = (ID) => {
    // To update current Calendar on page
    //test\

    getProjectEvents(ID)
      .then((result) => {
     
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

  const handleClickOpenAddEvent = () => {
    // To open Add Event
    setOpenAddEvent(true);
  };

  const handleClickOpenMemberList = () => {
    // To open Member List
    setOpenmemberList(true);
  };

  const handleClickOpenProjInfo = () => {
    // To Open Proj Info
    setOpenProjInfo(true);
  };

  const handleClickOpenModifyEvent = () => {
    // To open Modify event option after clicking on existing event
    setOpenModifyEvent(true);
  };

  const handleAddEvent = () => {
    // To add Event where it adds to database

    var clashing = false;
    getProjectEvents(projID).then((result) => {
      result.mergedEvents
        .map((eachEvent) => ({
          start: new Date(eachEvent.start),
          end: new Date(eachEvent.end),
        }))
        .map((eachEvent) => {
          const start = new Date(datetime1);
          const end = new Date(datetime2);
          if (
            (eachEvent.start < start && eachEvent.end > start) ||
            (eachEvent.start < end && eachEvent.end > end) ||
            (eachEvent.start >= start && eachEvent.end <= end)
          ) {
            clashing = true;
          }
        });

      if (eventName === "") {
        toast.error("Please fill in the Team Event Name");
      } else if (new Date(datetime1) >= new Date(datetime2)) {
        toast.error("Please select valid timings");
      } else if (new Date(datetime1) >= new Date(endDate)) {
        toast.error("Please select starting time to be before Project End")
      } else if (clashing) {
        toast.error("Cannot add Team Event that clashes with Blocked Events!");
        handleUpdateCal();
      } else {
        addNewEventToProject(
          {
            title: eventName,
            start: new Date(datetime1),
            end: new Date(datetime2),
          },
          projID
        ).then((result) => {
          handleUpdateCal();
          toast.success("Team Event added successfully!");
          handleCloseAddEvent();
        });
      }
    });
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

  const handleCloseMemberList = () => {
    setOpenmemberList(false);
    addNewMember("");
  };

  const handleCloseProjinfo = () => {
    setOpenProjInfo(false);
    setEndOfProj(currDateTime);
    setProjName("");
  };

  useEffect(() => {
    // To load Cal page using database everytime component refreshes/revisted
    getCurrentUserProjects()
      .then((result) => {
        setProjID(result.projects[props.projIndex]._id);
        setEndDate(new Date(result.projects[props.projIndex].endDate));
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

  const removeMember = (member) => {
    const newMemberList = members.filter((mem) => {
      return mem !== member;
    });

    addMembers(newMemberList);

    removeUserFromProject(member.uid, projID).then((result) => {
      handleUpdateCal();
      toast.success("Member removed successfully!");
    });
  };

  const handleUpdateProjName = () => {
  
    if (projName !== "") {
      changeProjectInfo(projID, { name: projName });
      getCurrentUserProjects().then((result) => {
        props.setProjTitle(result.projects[props.projIndex].name);
      });
      toast.success("Project Name changed successfully!");
    } else {
      toast.error("Please fill in a new Project Name");
    }
  };

  const handleUpdateProjEndDate = () => {
    changeProjectInfo(projID, { endDate: endOfProj });
    setEndDate(new Date(endOfProj));
    toast.success("End of Project changed successfully!");
  };

  const addEventDialog = (start, end, openDia, closeDia, handleAdd) => {
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
        style={{ textAlign: "center" }}
      >
        <DialogTitle id="form-dialog-title">Add Team Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="event-name"
            label="Team Event Name"
            type="event"
            onChange={handleEventName}
            fullWidth
          />
          <br></br>
          <TextField
            id="datetime-local"
            label="Team Event Start"
            type="datetime-local"
            defaultValue={start}
            className={classes.textField}
            onChange={handleDatetime1}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <br></br>
          <TextField
            id="datetime-local"
            label="Team Event End"
            type="datetime-local"
            defaultValue={end}
            onChange={handleDatetime2}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
          <br></br>

          <Grid
            container
            className={classes.buttons}
            spacing={3}
            justify="flex-end"
          >
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => handleAdd()}>
                {" "}
                ADD TEAM EVENT{" "}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => closeDia()}>
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
    const handleEndOfProj = (event) => {
      setEndOfProj(event.target.value);
    };

    const handleProjName = (event) => {
      setProjName(event.target.value);
    };

    return (
      <Dialog // Pop out for Add Event
        open={openProjInfo}
        onClose={handleCloseProjinfo}
        aria-labelledby="form-dialog-title"
        style={{ textAlign: "center" }}
      >
        <DialogTitle id="form-dialog-title">
          Update Project Information
        </DialogTitle>
        <DialogContent>
          <TextField
            onChange={handleProjName}
            label="New Project Name"
            variant="outlined"
          />
          <br></br>
          <br></br>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdateProjName()}
              fullWidth
            >
              {" "}
              UPDATE PROJECT NAME{" "}
            </Button>
          </Grid>
          <br></br>
          <TextField
            id="datetime-local"
            label="Current End of Project"
            type="datetime-local"
            defaultValue={inputDateTime(props.projEndDate)}
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
              onClick={() => handleUpdateProjEndDate()}
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

  const handleAddMembers = () => {
    //error handling for members, need to add checks for existence of members
    if (newMember === "") {
      toast.error(
        "Please fill in Email of a Group Member that you want to add"
      );
    } else {
      getProjectEvents(projID)
      .then((result) => {
        result.projectEvents.forEach((eachEvent) => {
          deleteProjectEvent(projID, eachEvent._id)
        })
      })

      addUserToProject(newMember, projID).then(
        (result) => {
          getCurrentUserProjects()
            .then((result) => {
              setProjID(result.projects[props.projIndex]._id);
              setEndDate(new Date(result.projects[props.projIndex].endDate));
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
          toast.success("Member added successfully! Please re-add all Team Events");
          handleUpdateCal();
        },
        (error) => {
          toast.error("Member is not a registered user!");
        }
      );
    }
  };

  const memberListDialog = () => {
    const handleNewMember = (event) => {
      addNewMember(event.target.value);
    };

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
          <Grid container align="center">
            <Grid item lg={10}>
              <TextField
                onChange={handleNewMember}
                label="Member's Email"
                variant="outlined"
              />
            </Grid>
            <Grid item lg={1}>
              <IconButton
                variant="contained"
                color="primary"
                style={{ height: 55, width: 50 }}
                onClick={() => handleAddMembers()}
              >
                <AddCircleIcon></AddCircleIcon>
              </IconButton>
            </Grid>
          </Grid>

          <br></br>
          <Typography> Member List:</Typography>
          <br></br>
      
          <List>
            {members.map((member, index) => (
              
              <Grid container align="center">
              <ListItem divider alignItems="flex-start">
                <ListItemIcon>
                  <GroupIcon></GroupIcon>
                </ListItemIcon>
                <ListItemText>
                  <td>
                    {index + 1 + ". " + member.email + " (" + member.name + ")"}
                  </td>
                </ListItemText>
                <td>
                  {index !== 0 ? (
                    <IconButton
                      color="secondary"
                      onClick={(e) => removeMember(member)}
                    >
                      <CancelIcon></CancelIcon>
                    </IconButton>
                  ) : (
                    ""
                  )}
                </td>
              </ListItem>
              </Grid>
            ))}
          </List>
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
        modifyProjectEvent({ title: newEventName }, projID, currEvent).then(
          (result) => handleUpdateCal()
        );
        toast.success("Team Event Name updated successfully!");
        handleCloseModifyEvent();
      } else {
        toast.error("Please fill in the New Team Event Name");
      }
    };

    const handleUpdateStartEnd = () => {
      var clashing = false;
      getProjectEvents(projID).then((result) => {
        result.mergedEvents
          .map((eachEvent) => ({
            start: new Date(eachEvent.start),
            end: new Date(eachEvent.end),
          }))
          .map((eachEvent) => {
            const start = new Date(newDateTime1);
            const end = new Date(newDateTime2);
            if (
              (eachEvent.start < start && eachEvent.end > start) ||
              (eachEvent.start < end && eachEvent.end > end) ||
              (eachEvent.start >= start && eachEvent.end <= end)
            ) {
              clashing = true;
            }
          });

        if (new Date(newDateTime1) >= new Date(newDateTime2)) {
          toast.error("Please select valid timings");
        } else if (new Date(newDateTime1) >= new Date(endDate)) {
          toast.error("Please select starting time to be before Project End");
        } else if (clashing) {
          toast.error("Modified Team Event is clashing with Blocked Events!");
          handleUpdateCal();
        } else {
          modifyProjectEvent(
            { start: newDateTime1, end: newDateTime2 },
            projID,
            currEvent
          ).then((result) => handleUpdateCal());
          toast.success("Team Event duration updated successfully!");
          handleCloseModifyEvent();
        }
      });
    };

    const handleDeleteEvent = () => {
      deleteProjectEvent(projID, currEvent).then((result) => handleUpdateCal());

      toast.success("Event successfully deleted!");
      handleCloseModifyEvent();
    };

    return (
      <Dialog // Pop out for Add Event
        open={openModifyEvent}
        onClose={handleCloseModifyEvent}
        aria-labelledby="form-dialog-title"
        style={{ textAlign: "center" }}
      >
        <DialogTitle id="form-dialog-title">
          Modify Current Team Event
        </DialogTitle>
        <DialogContent>
          <TextField
            label="New Team Event Name"
            variant="outlined"
            onChange={handleNewEventName}
          />
          <br></br>
          <br></br>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdateEventName()}
              fullWidth
            >
              {" "}
              UPDATE TEAM EVENT NAME{" "}
            </Button>
          </Grid>
          <br></br>
          <TextField
            id="datetime-local"
            label="New Team Event Start"
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
            label="New Team Event End"
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
              onClick={() => handleUpdateStartEnd()}
              fullWidth
            >
              {" "}
              UPDATE DURATION OF TEAM EVENT{" "}
            </Button>
          </Grid>
          <br></br>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteEvent()}
            fullWidth
          >
            {" "}
            DELETE CURRENT TEAM EVENT{" "}
          </Button>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />

      <Toast position="top-center"></Toast>
      {addEventDialog(
        currDateTime,
        currDateTime,
        openAddEvent,
        handleCloseAddEvent,
        handleAddEvent
      )}
      {addEventDialog(
        inputDateTime(slotDatetime1),
        inputDateTime(slotDatetime2),
        openSlotAddEvent,
        handleCloseSlotAddEvent,
        handleAddSlotEvent
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
            onClick={() => handleClickOpenProjInfo()}
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
            onClick={() => handleClickOpenMemberList()}
            startIcon={<GroupIcon></GroupIcon>}
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
            onClick={() => handleClickOpenAddEvent()}
            startIcon={<AddToQueueIcon />}
          >
            {" "}
            Add Team Event{" "}
          </Button>
        </Grid>
      </Grid>

      {ModifyEventDialog()}

      <Paper className={classes.paper}>
        <BigCalendar
          showMultiDayTimes={true}
          selectable
          events={event}
          defaultView="week"
          scrollToTime={new Date(2000, 1, 1, 6)}
          defaultDate={new Date()}
          onSelectEvent={(event) => {
            if (event.teamEvent) {

              setNewDateTime1(event.start);
              setNewDateTime2(event.end);
              setCurrEvent(event.id);
              handleClickOpenModifyEvent();
            } else {
              toast.error("Cannot modify personal events!");
            }
          }}
          onSelectSlot={(slotInfo) => {
            setSlotDatetime1(slotInfo.start);
            setSlotDatetime2(slotInfo.end);

            handleClickOpenSlotAddEvent(slotInfo.start, slotInfo.end);
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

export default TeamCalendarPage;
