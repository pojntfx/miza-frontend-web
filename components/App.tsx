import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { CheckBox, Settings } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import {
  Divider,
  CssBaseline,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
} from "@material-ui/core";

const todos = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({
  title: `Title ${t}`,
  body: `Text ${t}`,
}));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      minHeight: "100vh",
      paddingBottom: theme.spacing(4),
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: "auto",
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: "absolute",
      marginTop: -30,
      left: "50%",
      transform: "translateX(-50%)",
    },
    settingsButton: {
      marginLeft: "auto",
    },
    addIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

export default () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <Typography className={classes.text} variant="h5" gutterBottom>
          Todos
        </Typography>
        <List className={classes.list}>
          {todos.map(({ title, body }, i) => (
            <React.Fragment key={i}>
              {i != 0 && <Divider />}
              <ListItem button key={i}>
                <ListItemText primary={title} secondary={body} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <CheckBox />
          </IconButton>
          <Fab
            color="secondary"
            variant="extended"
            className={classes.fabButton}
          >
            <AddIcon className={classes.addIcon} /> Add Todo
          </Fab>
          <IconButton
            edge="end"
            color="inherit"
            className={classes.settingsButton}
          >
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};
