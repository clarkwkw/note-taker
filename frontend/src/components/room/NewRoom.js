import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ParticipantBox from './ParticipantBox';
import { authStateStore } from '../../utils/auth';
import Redirect from 'react-router-dom/Redirect';
import warningRouter from '../../utils/warningRouter';

const styles = theme => ({
    card: {
      //width: '100%',
      //maxWidth: '350px',
      backgroundColor: theme.palette.background.paper,
      marginTop: '10px'
    },
    button:{
        //margin: theme.spacing.unit,
    },
});

class NewRoom extends React.Component{
    state = {
        roomName: "",
        meetingTime: (new Date()).toISOString().slice(0, 16),
        participants: []
    }

    submit = evt => {

    }

    render(){
        const { classes } = this.props;
        if(!authStateStore.isLoggedIn()){
            warningRouter.pushWarning("Please login");
            return (<Redirect to="/login" />);
        }
        return (
            <form onSubmit={this.submit}>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="roomName"
                                    name="roomName"
                                    label="Room name"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="meetingTime"
                                    label="Meeting time"
                                    type="datetime-local"
                                    defaultValue={this.state.meetingTime}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <ParticipantBox includeUsers={this.state.participants} />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <div align="center">
                                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                        Create
                                </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </form>
        );
    }
}

NewRoom.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(NewRoom);