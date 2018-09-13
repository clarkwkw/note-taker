import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LoginIcon from 'mdi-material-ui/Login';
import SidebarItem from './components/SidebarItem';
import WarningSnackBar from './components/WarningSnackBar';
import dashboardStyle from './material/dashboardStyle';
import sidebarItems from './constants/sidebarItems';
import { history, Routes } from './routes';
import { Router } from 'react-router-dom';
import { authStateStore } from './utils/auth';

class App extends React.Component {
  state = {
    open: false,
    loggedIn: authStateStore.isLoggedIn(),
  }

  constructor(props){
    super(props);
    authStateStore.addLoggedInListener(() => this.setLoggedIn(true));
    authStateStore.addLoggedOutListener(() => this.setLoggedIn(false));
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  setLoggedIn = (loggedIn) => {
    this.setState({ loggedIn });
  }
  render() {
    const { classes } = this.props;
    let sidebarItemKey = 0;
    return (
      <div className="App">
      <Router history={history}>
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <WarningSnackBar />
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                Note Taker
              </Typography>
                {
                  this.state.loggedIn?
                  (<Button className={classes.logoutButton} onClick={authStateStore.logout} variant="outlined">
                    Logout
                  </Button>):
                  (<Button className={classes.logoutButton} onClick={() => history.push("/register")} variant="outlined">
                    Register
                </Button>)
                }
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <div>
              {
                this.state.loggedIn?
                sidebarItems.map(item => (
                  <SidebarItem key={sidebarItemKey++} icon={item.icon} text={item.text} url={item.url}/>
                )):
                (<SidebarItem icon={<LoginIcon />} text="Login" url="/login"/>)
              }
              </div>
            </List>
            <Divider />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Routes />
          </main>
        </div>
      </React.Fragment>
      </Router>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(App);