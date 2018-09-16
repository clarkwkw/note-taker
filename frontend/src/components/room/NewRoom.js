import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AvatarList from './AvatarList';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { authStateStore } from '../../utils/auth';
import { getCurJSTime } from '../../utils/date';
import Redirect from 'react-router-dom/Redirect';
import warningRouter from '../../utils/warningRouter';
import { validateMeetingTime } from '../../utils/validation';
import AutoCompleteMultiTextField from '../AutoCompleteMultiTextField';
import { searchUser } from '../../transport/user';
import { createRoom } from '../../transport/room';
import { history } from '../../routes';

const styles = theme => ({
    card: {
      //width: '100%',
      //maxWidth: '350px',
      backgroundColor: theme.palette.background.paper,
      marginTop: '10px',
      paddingBottom: '80px'
    },
    button:{
        //margin: theme.spacing.unit,
    },
});

class NewRoom extends React.Component{
    state = {
        roomName: "",
        meetingTime: getCurJSTime(),
        participants: [],
        isOnline: false
    }
    userObjs = {}

    submit = evt => {
        evt.preventDefault();
        createRoom(this.state.roomName, this.state.meetingTime, this.state.participants, this.state.isOnline?"ONLINE":"OFFLINE").then(
            roomId => {
                warningRouter.pushWarning("Room created")
                history.push("/room/"+roomId);
            },
            err => {
                warningRouter.pushWarning(err.message)
            }
        )
    }

    onRoomNameChanged = evt => {
        this.setState({ roomName: evt.target.value });
    }

    onMeetingTimeChanged = evt => {
        this.setState({ meetingTime: evt.target.value });
    }

    onIsOnlineChanged = evt => {
        this.setState({ isOnline: evt.target.checked });
    }

    onParticipantsChanged = selectedParticipantObjs => {
        this.setState({ participants: selectedParticipantObjs.map(obj => obj.key) });
    }

    onParticipantSearchStringUpdated = async username => {
        let users = await searchUser(username, 5);
        let castedUsers = users.map(user => {
            if(!(user.id in this.userObjs)){
                this.userObjs[user.id] = user;
            }
            return {key: user.id, label: user.username}
        });
        return castedUsers;
    }

    render(){
        const { classes } = this.props;
        let meetingTimeValidated = validateMeetingTime(Date.parse(this.state.meetingTime));
        
        if(!authStateStore.isLoggedIn()){
            warningRouter.pushWarning("Please login");
            return (<Redirect to="/login" />);
        }
        return (
            <form onSubmit={this.submit}>
                <Card className={classes.card}>
                    <CardContent>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={12}>
                                <div align="right">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                            checked={this.state.isOnline}
                                            onChange={this.onIsOnlineChanged}
                                            value="checkedA"
                                            color="primary"
                                            />
                                        }
                                        label="Online meeting"
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="roomName"
                                    name="roomName"
                                    label="Room name"
                                    onChange={this.onRoomNameChanged}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="meetingTime"
                                    error={!meetingTimeValidated.isValid}
                                    label="Meeting time"
                                    type="datetime-local"
                                    defaultValue={this.state.meetingTime}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.onMeetingTimeChanged}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>  
                                <AutoCompleteMultiTextField 
                                    title="Participants"
                                    placeholder="Search by username" 
                                    suggestionSource={this.onParticipantSearchStringUpdated}
                                    changeHanler={this.onParticipantsChanged}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <AvatarList users={this.state.participants.map(userId => this.userObjs[userId])} rowSize={5} border />
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