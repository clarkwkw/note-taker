import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import { history } from '../../routes';
import { authStateStore } from '../../utils/auth';
import warningRouter from '../../utils/warningRouter';

const styles = theme => ({
    card: {
      width: '100%',
      maxWidth: '350px',
      backgroundColor: theme.palette.background.paper,
      marginTop: '45px'
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
        password: ""
    }

    login = (e) => {
        e.preventDefault();
        authStateStore.login(this.state.username, this.state.password).then(
            () => {
                // success
                history.push("/");
            },
            () => {
                // LoginError
                warningRouter.pushWarning("Login Failed.");
            }
        )
    }

    onUsernameChanged = (evt) => {
        this.setState({ username: evt.target.value });
    }

    onPasswordChanged = (evt) => {
        this.setState({ password: evt.target.value });
    }

    render = () => {
        const { classes } = this.props;

        if(authStateStore.isLoggedIn()){
            history.push("/");
            return (null);
        }
        
        return (
            <div align="center"> 
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