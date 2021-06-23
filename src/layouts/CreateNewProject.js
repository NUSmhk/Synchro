import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  Container,
  Button,
  Typography,
  Grid, 
  Paper
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

function CreateNewProject() {
  const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
return(
<main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
            {/* Chart */}
            <Grid>
              <Paper className={fixedHeightPaper} justify="center">



                  <Typography>

                    Create a New Project
                  </Typography>



                  <ValidatorForm className={classes.form}>


              <br/>

              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="Project Name"
                name="email"
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "Email is not valid"]}
                autoComplete="off"
              />
              <br />
              <TextValidator
                variant="outlined"
                fullWidth
                label="Add Group Member"
                name="password"
                type="password"
    
                validators={["required"]}
                errorMessages={["this field is required"]}
                autoComplete="off"
              />
              <br />
    
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



)
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },

    accountCircle: {
      fontSize: 200
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      alignItems: "center",
      paddingLeft: "400px",
      paddingRight: "400px"
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