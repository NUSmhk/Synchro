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
} from "@material-ui/core";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import { fire, db } from "../helpers/db";
import Toast from "../Components/Toast";
import { getCurrentUserProjects } from "../services/userServices";
import TeamCalendarPage from "./TeamCalendarPage copy";

function MyProjects(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [projects, setProjects] = useState({ projects: [] });

  //To load My Projects list everytime component loads, using backend's storage of list of projs
  useEffect(() => {
    // const handleUpdate = () => {
    //   test
    //   const user = fire.auth().currentUser;
    //   db.collection("users")
    //     .doc(user.uid)
    //     .collection("projects")
    //     .doc(user.uid)
    //     .get()
    //     .then((doc) => {
    //       if (doc.exists) {
    //         const fireProj = doc.data().proj;

    //         if (fireProj !== undefined) {
    //           setProjects(doc.data().proj);
    //         }
    //       } else {
    //       }
    //     });

    //   console.log(getCurrentUserProjects())

    //   getCurrentUserProjects().then(
    //     (result) =>{ setTest(result); console.log(test)})
    // };

    // console.log(test)
    // handleUpdate();

    getCurrentUserProjects().then((data) => setProjects(data));
  
  }, []);

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        {/* Chart */}
        <Grid>
          <Paper className={fixedHeightPaper} justify="center">
            <Toast position="top-right"></Toast>
            <Typography>My Projects</Typography>

            <List>
              {projects.projects.map((task, index) => (
                <ListItem
                  divider
                  alignItems="flex-start"
                  button
                  onClick={() => {
                    props.setTeamPages(<TeamCalendarPage projIndex={index} setProjTitle={props.setTeamTitles}/>);
                    props.setTeamTitles(task.name);
                  }}
                >
                  <ListItemIcon>
                    <WorkOutlineIcon></WorkOutlineIcon>
                  </ListItemIcon>
                  <ListItemText>
                    <td>{task.name}</td>
                  </ListItemText>
                </ListItem>
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
