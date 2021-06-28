import React, { useState } from "react";
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
  CircularProgress,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {fire} from "../helpers/db";
import { ToastContainer, toast } from "react-toastify";

const Login = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [rememberme, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  //   const handleCheck = (event) => {
  //     setRememberMe(event.target.checked);
  //   };
  const handlerLogin = () => {
    setLoading(true);
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const { user } = response;
        // const data = {
        //   userId: user.uid,
        //   email: user.email,
        //   name: user.displayName
        // };
        // localStorage.setItem("user", JSON.stringify(data));
        // const storage = localStorage.getItem("user");
        // const loggedInUser = storage !== null ? JSON.parse(storage) : null;
        props.loggedIn(user);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <Card className={classes.card}>
        <CardContent>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
          />
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
              Login to your account
            </Typography>
            <ValidatorForm
              onSubmit={handlerLogin}
              onError={(errors) => {
                for (const err of errors) {
                  console.log(err.props.errorMessages[0]);
                }
              }}
              className={classes.form}
            >
              <TextValidator
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                onChange={handleEmail}
                name="email"
                value={email}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
                autoComplete="off"
                required
              />
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
                required
              />
   
              {loading ? (
                <CircularProgress
                  color="primary"
                  size={24}
                  className={classes.buttonProgress}
                ></CircularProgress>
              ) : (
                <Grid></Grid>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
              >
                LOGIN
              </Button>
        
              <Grid container>
                <Grid item>
                  <Link
                    onClick={props.toggle}
                    className={classes.pointer}
                    variant="body2"
                  >
                    {"Register for an account"}
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
    // background: "#262626",
  },
  pointer: {
    cursor: "pointer",
  },
  buttonProgress: {
    position: "relative",
    left: "50%",
    marginTop: 5,
    marginLeft: -13,
  },
}));
export default Login;
