import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  CssBaseline,
  Drawer,
  AppBar,
  Button,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid, 
  Paper
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import  MainListItems from "./lisItems";
import Profile from "./Profile";
import CalendarPage from "./CalendarPage";
import fire from "../helpers/db"

const NavBar = (props) => {
  const classes = useStyles();
  const [openD, setOpen] = React.useState(true);
  const [page, setPage] = React.useState(<CalendarPage/>);
  const [title, setTitle] = React.useState("My Calendar")


  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    localStorage.removeItem("user");
    fire.auth().signOut();
    props.setUserState();
    

  };  

  

  return (
    <div className={classes.root}>
      <CssBaseline>

      <AppBar
        position="absolute"
        className={clsx(classes.appBar, openD && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              openD && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            className={classes.title}
          >
          {title}
          </Typography>
          
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !openD && classes.drawerPaperClose),
        }}
        open={openD}
      >


        <div className={classes.toolbarIcon}>
          
        <img
              src={"/logo3.jpg"}
              alt=""
              style={{
                height: 70,
                marginTop: -5,
                paddingRight: 10

              }}
            />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />
        <List>{<MainListItems page={page} setPages={setPage} title={title} setTitles={setTitle}/>}</List>
        <Divider />

        <Button variant="contained" color="primary" onClick={handleClose}>
          Logout
        </Button>

      </Drawer>

  {page}

      </CssBaseline>
      
    </div>
    
  );
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
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
}));

export default NavBar;
