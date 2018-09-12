import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import Lock from '@material-ui/icons/Lock';
import { history } from '../../routes';
import { authStateStore } from '../../utils/auth';

const styles = theme => ({
    card: {
      width: '100%',
      maxWidth: '350px',
      backgroundColor: theme.palette.background.paper,
      marginTop: '60px'
    },

    margin: {
        margin: theme.spacing.unit,
    },

    centerItem:{
        justifyContent: 'center'
    }
});

class LoginPage extends React.Component{
    state = {
        username: "",
        password: "",
        snackbar: {
            open: false,
            message: ""
        }
    }
    snackbarMessageQueue = []

    login = (e) => {
        e.preventDefault();
        authStateStore.login(this.state.username, this.state.password).then(
            () => {
                // success
                history.push("/");
            },
            () => {
                // LoginError
                this.pushSnackBarMessage("Login Failed.");
            }
        )
    }

    pushSnackBarMessage(message){
        this.snackbarMessageQueue.push(message);
        this.popSnackBarMessage();
    }

    popSnackBarMessage(){
        if(!this.state.snackbar.open && this.snackbarMessageQueue.length > 0){
            this.setState({snackbar: {open: true, message: this.snackbarMessageQueue.pop()}});
        }
    }

    handleSnackBarClose(){
        this.setState({snackbar: {open: false, message: ""}});
        this.popSnackBarMessage();
    }

    onUsernameChanged = (evt) => {
        this.setState({ username: evt.target.value });
    }

    onPasswordChanged = (evt) => {
        this.setState({ password: evt.target.value });
    }

    render = () => {
        const { classes } = this.props;
        const { open: snackbarOpen, message: snackbarMessage } = this.state.snackbar;
        return (
            <div align="center"> 
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={snackbarOpen}
                    onClose={this.handleSnackBarClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{snackbarMessage}</span>}
                    action={[
                        <IconButton
                          key="close"
                          aria-label="Close"
                          color="inherit"
                          className={classes.close}
                          onClick={this.handleSnackBarClose.bind(this)}
                        >
                        <CloseIcon className={classes.icon} />
                        </IconButton>
                    ]}
                />
                <form onSubmit={this.login}>
                <Card className={classes.card}>
                    <CardContent>
                        <List component="nav">
                            <ListItem className={classes.centerItem}>
                                <TextField
                                    className={classes.margin}
                                    id="username-field"
                                    label="Username"
                                    onChange={this.onUsernameChanged}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            <AccountCircle />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ListItem>
                            <ListItem className={classes.centerItem}>
                                <TextField
                                    className={classes.margin}
                                    id="password-field"
                                    label="Password"
                                    type="password"
                                    onChange={this.onPasswordChanged}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            <Lock />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ListItem>
                            <ListItem className={classes.centerItem}>
                                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                        Login
                                    </Button>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
                </form>
            </div>
        );

    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(LoginPage);