import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@material-ui/core";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import { fire, db } from "../helpers/db";
import Toast from "../Components/Toast";
import { getCurrentUserProjects } from "../services/userServices";
import TeamCalendarPage from "./TeamCalendarPage";
import TeamCalendarPageNM from "./TeamCalendarPageNM";
import CancelIcon from "@material-ui/icons/Cancel";
import { deleteProject, getProjectUsers } from "../services/projectServices";
import { toast } from "react-toastify";
import Profile from "./Profile";

function MyProjects(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [projects, setProjects] = useState({ projects: [] });
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [delProj, setDelProj] = useState("");
  const [updater,setUpdater] = useState(0);

  const handleClickOpenConfirmation = (proj) => {
    setOpenConfirmation(true);
    setDelProj(proj._id)
  }

  const handleUpdateProj = () => {
    setUpdater(updater + 1)
  }

  const ConfirmationDialog = () => {  

    const handleCloseConfirmation = () => {
      setOpenConfirmation(false)
    }
    
     const handleDeleteProj = () => {
       console.log(delProj)
      deleteProject(delProj).then(result => {toast.success("Project deleted successfully!"); setOpenConfirmation(false); handleUpdateProj()})
      console.log(delProj)
   
    }
  
   
    return (
      <Dialog // Pop out for Add Event
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="form-dialog-title"
        
      >
        <DialogTitle id="form-dialog-title">Confirm Project Deletion?</DialogTitle>
        <DialogContent>
         
        <Typography></Typography>

          <Grid
            container
            className={classes.buttons}
            spacing={6}
            justify="center"
          >
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleDeleteProj} >
                {" "}
                YES{" "}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleCloseConfirmation}>
                {" "}
                NO{" "}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };




  //To load My Projects list everytime component loads, using backend's storage of list of projs
  useEffect(() => {
  
    
    getCurrentUserProjects().then((data) => {setProjects(data); console.log(data)});
    
 
  
  }, [updater]);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        {ConfirmationDialog()}
        <Grid

        wrap='nowrap'
>    
          <Paper className={fixedHeightPaper} justify="center">
            <Toast position="top-right"></Toast>
            <Typography>My Projects</Typography>

            <List>
              {projects.projects.map((proj, index) => (
                <Grid>
                <ListItem
                  divider
                  alignItems="flex-start"
                  button
                  onClick={() => {

                    getProjectUsers(proj._id).then(result => {

                     if(fire.auth().currentUser.uid === result[0].uid) {
                        
                    props.setTeamPages(<TeamCalendarPage projIndex={index} setProjTitle={props.setTeamTitles}/>);
                    props.setTeamTitles(proj.name);

                     } else {

                      props.setTeamPages(<TeamCalendarPageNM projIndex={index} projName={proj.name} projEndDate={proj.endDate}/>)
                      props.setTeamTitles(proj.name);

                     }

                    })

                  }}
                >
                  <ListItemIcon>
                    <WorkOutlineIcon></WorkOutlineIcon>
                  </ListItemIcon>
                  <ListItemText>
                    {proj.name}
                  </ListItemText>
                  
                </ListItem>


<IconButton color="secondary" onClick={(e) => handleClickOpenConfirmation(proj)}>
  <CancelIcon></CancelIcon>
  </IconButton>
  
  </Grid> 
              ))}
            </List>
          </Paper>
        </Grid>
      </Container>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  accountCircle: {
    fontSize: 200,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
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
    alignItems: "center",
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    alignItems: "center",
  },
  fixedHeight: {
    height: 800,
  },
}));

export default MyProjects;
