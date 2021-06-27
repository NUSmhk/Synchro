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
  MenuItem

} from "@material-ui/core";
import  AddCircleIcon from "@material-ui/icons/AddCircle";
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import GroupIcon from "@material-ui/icons/Group";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import fire from "../helpers/db";

function MyProjects(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);


  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        {/* Chart */}
        <Grid>
          <Paper className={fixedHeightPaper} justify="center">
            <Typography>My Projects</Typography>

            <List>
              {props.projTitle.map((task, index) => (
                  
                 
              <ListItem divider alignItems="flex-start" button>
                <ListItemIcon>
                  <WorkOutlineIcon></WorkOutlineIcon>

                </ListItemIcon>
                <ListItemText>
                  <td>{task.description}</td>
                  </ListItemText>
           
              </ListItem>
            
    
              ))
              }
              
              
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
