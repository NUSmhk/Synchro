import React, { useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  MenuItem,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import GroupIcon from "@material-ui/icons/Group";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {fire, db} from "../helpers/db";

function CreateNewProject(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [members, addMembers] = useState([]);
  const [newMember, addNewMember] = useState("");
  const [projectTitle, addProjectTitle] = useState("");

  const handleProjectTitle = (event) => {
    addProjectTitle(event.target.value);
  };

  const handleAddMembers = () => {
    newMember === ""
      ? addMembers([...members])
      :           addMembers([
              ...members,
              {
                description: newMember,
              },
            ])
    // if (newMember === "") {
    //   addMembers([...members])
    // } else {
    //   db.collectionGroup("userInfo").where('Emmail', '==', newMember).get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       if (doc.exists) {
    //         addMembers([
    //           ...members,
    //           {
    //             description: newMember
    //           }
    //         ])
    //       } else {
    //         addMembers([...members])
    //       }
    //     })


    //   })
    // }


  };

  const handleNewProject = () => {
    props.setProjTitle(projectTitle);
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        {/* Chart */}
        <Grid>
          <Paper className={fixedHeightPaper} justify="center">
            <Typography>Create a New Project</Typography>

            <ValidatorForm className={classes.form} onSubmit={handleNewProject}>
              <br />

              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="Project Name"
                name="Project Name"
                // validators={["required"]}
                // errorMessages={["this field is required"]}
                autoComplete="off"
                onChange={handleProjectTitle}
              />
              <br />

              <Grid container justify="flex-left">
                <Grid item lg={11}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    label="Add Group Member"
                    // validators={["required"]}
                    // errorMessages={["this field is required"]}
                    autoComplete="off"
                    onChange={(event) => {
                      addNewMember(event.target.value);
                    }}
                  />
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
                {members.map((task, index) => (
                  <ListItem divider alignItems="flex-start">
                    <ListItemIcon>
                      <GroupIcon></GroupIcon>
                    </ListItemIcon>
                    <ListItemText>
                      <td>{index + 1}. </td>
                      <td>{task.description}</td>
                    </ListItemText>
                    {/* <Typography>
                  {task.description}
                </Typography>
                 */}
                  </ListItem>
                ))}
              </List>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create New Project
              </Button>
            </ValidatorForm>
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

export default CreateNewProject;
