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
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from 'mdi-material-ui/Email';
import { history } from '../../routes';
import warningRouter from '../../utils/warningRouter';
import { validatePassword, validateEmail, validateUsername } from '../../utils/validation';
import { register } from '../../transport/rest';
import { authStateStore } from '../../utils/auth';
import { Redirect } from 'react-router';

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

class RegisterPage extends React.Component{
    state = {
        username: "",
        password: "",
        password2: "",
        email: ""
    }

    register = async (e) => {
        e.preventDefault();
        if(!validatePassword(this.state.password, this.state.password2).isValid){
            warningRouter.pushWarning("Invalid Password");
            return;
        }

        if(!validateEmail(this.state.email).isValid){
            warningRouter.pushWarning("Invalid Email");
            return;
        }

        if(!validateUsername(this.state.username).isValid){
            warningRouter.pushWarning("Invalid Username");
            return;
        }

        try{
            await register(this.state.username, this.state.password, this.state.email);
            warningRouter.pushWarning("Congrats! You've been registered.");
            await authStateStore.login(this.state.username, this.state.password);
            history.push("/");
        }catch(e){
            if(e.message === "alreadyExist"){
                warningRouter.pushWarning("This username has been used.");
            }else{
                warningRouter.pushWarning("Unknown error: "+e.message);
            }
        }
    }

    onUsernameChanged = (evt) => {
        this.setState({ username: evt.target.value });
    }

    onPasswordChanged = (evt) => {
        let password = evt.target.value, password2 = this.state.password2;
        this.setState({ password, passwordMatched: password === password2 });
    }

    onPassword2Changed = (evt) => {
        let password = this.state.password, password2 = evt.target.value;
        this.setState({ password2, passwordMatched: password === password2 });
    }

    onEmailChanged = (evt) => {
        this.setState({ email: evt.target.value });
    }

    render = () => {
        const { classes } = this.props;
        let passwordValidated = validatePassword(this.state.password, this.state.password2);
        let emailValidated = validateEmail(this.state.email);
        let password2Red = this.state.password2.length > 0 && !passwordValidated.isValid;
        let emailRed = this.state.email.length > 0 && !emailValidated.isValid;

        if(authStateStore.isLoggedIn()){
            return (<Redirect to="/" />);
        }

        return (
            <div align="center"> 
                <form onSubmit={this.register}>
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
                                            <LockIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ListItem>
                            <ListItem className={classes.centerItem}>
                                <TextField
                                    className={classes.margin}
                                    error={password2Red}
                                    id="password2-field"
                                    label={password2Red?passwordValidated.message:"Please enter again"}
                                    type="password"
                                    onChange={this.onPassword2Changed}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            <LockIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ListItem>
                            <ListItem className={classes.centerItem}>
                                <TextField
                                    className={classes.margin}
                                    error={emailRed}
                                    id="email-field"
                                    label={emailRed?emailValidated.message:"Email Address"}
                                    onChange={this.onEmailChanged}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            <EmailIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </ListItem>
                            <ListItem className={classes.centerItem}>
                                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                        Register
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

RegisterPage.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(RegisterPage);