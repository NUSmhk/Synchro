import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  Grid,
  Link,
  makeStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { fire, db } from "../helpers/db";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import firebase from "firebase";
import Toast from "../Components/Toast";

const SignUp = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

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

  //everything done when registration is successful
  const handleSignUp = () => {
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const user = fire.auth().currentUser;
        if (response) {
          props.toggle();

          //Update user name in firestore
          user.updateProfile({
            displayName: name,
          });

          //Update user info which is name + email
          db.collection("users")
            .doc(user.uid)
            .collection("userInfo")
            .doc(user.uid)
            .set({
              Name: name,
              Email: email,
            });

          //Set empty array for projects in firestore
          db.collection("users")
            .doc(user.uid)
            .collection("projects")
            .doc(user.uid)
            .set({});

          //Set empty array for events for user calendar in firestore
          db.collection("users")
            .doc(user.uid)
            .collection("Events")
            .doc(user.uid)
            .set({});

          //To set collection of all emails/but need to find a way to update them with profile updates
          db.collection("allEmail")
            .doc("emails")
            .update({
              emails: firebase.firestore.FieldValue.arrayUnion({
                Email: email,
              }),
            });
            
          toast.success("User Registered Successfully");
        }
      })
      .catch((error) => {
        // eslint-disable-next-line default-case
        switch (error.code) {
          case "auth/email-already-in-use":
            toast.error(error.message);
            break;
          case "auth/invalid-email":
            toast.error(error.message);
            break;
          case "auth/weak-password":
            toast.error(error.message);
            break;
        }
      });
  };

  //To have custom validation check of confirming passwords for validation form
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

  return (
    <Container component="main" maxWidth="xs">
      <Card className={classes.card}>
        <CardContent>
          <Toast position="top-center"></Toast>
          <CssBaseline />
          <div className={classes.paper}>
            <img
              src={"/logo3.jpg"}
              alt=""
              style={{
                height: 100,
                marginTop: -40,
              }}
            />
            <Typography component="h1" variant="h5">
              Register your account
            </Typography>
            <ValidatorForm onSubmit={handleSignUp} className={classes.form}>
              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="Name"
                onChange={handleName}
                name="name"
                value={name}
                validators={["required"]}
                errorMessages={["this field is required"]}
                autoComplete="off"
              />

              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                onChange={handleEmail}
                name="email"
                value={email}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "Email is not valid"]}
                autoComplete="off"
              />
              <br />
              <TextValidator
                variant="outlined"
                fullWidth
                label="Password"
                onChange={handlePassword}
                name="password"
                type="password"
                value={password}
                validators={["required"]}
                errorMessages={["this field is required"]}
                autoComplete="off"
              />
              <br />
              <TextValidator
                variant="outlined"
                label="Confirm password"
                fullWidth
                onChange={handleConfirmPassowerd}
                name="confirmPassword"
                type="password"
                validators={["isPasswordMatch", "required"]}
                errorMessages={["Password mismatch", "this field is required"]}
                value={confirmPassword}
                autoComplete="off"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                REGISTER
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    onClick={props.toggle}
                    className={classes.pointer}
                    variant="body2"
                  >
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </ValidatorForm>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  card: {
    marginTop: "60px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
  },
  pointer: {
    cursor: "pointer",
  },
}));
export default SignUp;
