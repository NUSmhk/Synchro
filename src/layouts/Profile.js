import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import fire from "../helpers/db";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const user = fire.auth().currentUser;
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // const currUserName = JSON.parse(localStorage.getItem("user")).name;
  // const currUserEmail = JSON.parse(localStorage.getItem("user")).email;
  // const currUserId = JSON.parse(localStorage.getItem("user")).userId;

  // fire.auth().currentUser.displayName
  // fire.auth().currentUser.email
  const [changedName, setchangedName] = useState(
    fire.auth().currentUser.displayName
  );
  const [changedEmail, setchangedEmail] = useState(
    fire.auth().currentUser.email
  );

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPassowerd = (event) => {
    setConfirmPassword(event.target.value);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== password) {
        return false;
      }
      return true;
    });
    return () => {
      ValidatorForm.removeValidationRule("isPasswordMatch");
    };
  }, [password]);

  const handleUpdate = () => {
    

    if (name !== "") {
      user
        .updateProfile({
          displayName: name,
        })
        .then(() => {setchangedName(name); toast.success("Name changed successfully");})
        .catch((error) => {
          toast.error(error.message);
        });
    }
    if (email !== "") {
      user
        .updateEmail(email)
        .then(() => {setchangedEmail(email); toast.success("Email changed successfully");})
        .catch((error) => toast.error(error.message));
    }

    if (password !== "") {
      user
        .updatePassword(password)
        .then(() => {toast.success("Password changed successfully")})
        .catch((error) => toast.error(error.message));
    }
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="xs" className={classes.container}>
        <Grid>
          <Card className={fixedHeightPaper} justify="center">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
            />
            <Typography>Profile Page</Typography>

            <AccountCircleIcon
              className={classes.accountCircle}
            ></AccountCircleIcon>

            <ValidatorForm className={classes.form} onSubmit={handleUpdate}>
              <Paper>
                <Typography style={{ height: 25 }}>
                  Name: {changedName}
                </Typography>
              </Paper>

              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="New Name"
                name="name"
                value={name}
                autoComplete="off"
                onChange={handleName}
              />
              <br />
              <Paper>
                <Typography style={{ height: 25 }}>
                  Email: {changedEmail}
                </Typography>
              </Paper>

              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="New Email Address"
                name="email"
                value={email}
                validators={["isEmail"]}
                errorMessages={["Email is not valid"]}
                autoComplete="off"
                onChange={handleEmail}
              />
              <br />
              <TextValidator
                variant="outlined"
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={password}
                onChange={handlePassword}
                autoComplete="off"
              />
              <br />
              <TextValidator
                variant="outlined"
                label="Confirm New Password"
                fullWidth
                onChange={handleConfirmPassowerd}
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                validators={["isPasswordMatch"]}
                errorMessages={["Password mismatch"]}
                autoComplete="off"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                UPDATE PROFILE
              </Button>
            </ValidatorForm>
          </Card>
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
    flexDirection: "column",
    alignItems: "center",
  },
  fixedHeight: {
    height: 800,
  },
}));

export default Profile;
