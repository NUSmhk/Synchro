import React, { useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Toast from "../Components/Toast";
import { toast } from "react-toastify";

function CreateNewProject(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [projectTitle, addProjectTitle] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const handleProjectTitle = (event) => {
    addProjectTitle(event.target.value);
  };

  const handleEndDate = (event) => {
    setEndDateTime(event.target.value);
  };

  //To add into firebase under user's project when submit button is pressed
  const handleNewProject = () => {
    //Error handling for project title input
    if (projectTitle === "") {
      toast.error("Please fill in the Project Name");
    } else if (endDateTime === "") {
      toast.error("Please select date and time of the End of Project");
    } else {
      toast.success(
        "Project successfully created! Please check under My Projects to access it"
      );
      props.setProjTitle(projectTitle, endDateTime);
    }
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        {/* Chart */}
        <Grid>
          <Paper className={fixedHeightPaper} justify="center">
            <Toast></Toast>
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
              <TextField
                id="datetime-local"
                label="End of Project"
                type="datetime-local"
                className={classes.textField}
                fullWidth
                onChange={handleEndDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />

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
