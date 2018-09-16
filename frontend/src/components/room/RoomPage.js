import React from 'react';
import { getRoom, addTextMessage, addSpeechMessage } from '../../transport/room';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'; 
import AvatarList from './AvatarList';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import FloatingButton from '../FloatingButton';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NativeSelect from '@material-ui/core/NativeSelect';
import Typography from '@material-ui/core/Typography';
import { toFullFormattedDateTimeStr } from '../../utils/date';
import AddIcon from '@material-ui/icons/Add';
import OfflineIcon from '@material-ui/icons/GroupRounded';
import OnlineIcon from '@material-ui/icons/ComputerRounded';
import RecordIcon from '@material-ui/icons/RecordVoiceOver';
import TextIcon from '@material-ui/icons/Note';
import { Redirect } from 'react-router';
import warningRouter from '../../utils/warningRouter';
import * as _ from 'lodash';
import Modal from '../../Modal';
import TextField from '@material-ui/core/TextField';
import { validateMessage } from '../../utils/validation';

const styles = theme => ({
    progress: {
      margin: theme.spacing.unit * 2,
    },
    card: {
        minWidth: 275,
        marginBottom: 30
    },
    pos: {
        marginBottom: 12,
    },
    title: {
        fontSize: 20
    }
  });
  
class RoomPage extends React.Component{
    state = {
        room: null,
        messageText: "",
        messageType: "TEXT",
        messageFilePath: "",
        messageFile: null
    }

    constructor(props){
        super(props);
        this.fetchRoom();
        this.modal = null;
    }

    async fetchRoom(){
        let room = await getRoom(this.props.id);
        this.setState({ room: room });
    }

    newTextMessage = async () => {
        let validated = validateMessage(this.state.messageText);
        if(!validated.isValid)throw Error(validated.message);
        return await addTextMessage(this.props.id, this.state.messageText);
    }

    newSpeechMessage = async () => {
        if(_.isNil(this.state.messageFile))throw Error("File not selected");
        return await addSpeechMessage(this.props.id, this.state.messageFile, "en-US");
    }

    newMessage = evt => {
        evt.preventDefault();
        
        const messageTransport = this.state.messageType == "TEXT"?this.newTextMessage:this.newSpeechMessage;

        const messageSent = () => {
            this.setState({
                messageText: "",
                messageType: "TEXT",
                messageFilePath: "",
                messageFile: null
            });
            this.modal.handleClose();
            warningRouter.pushWarning("Message sent");
            this.fetchRoom();
        }
        const onError = err => {
            warningRouter.pushWarning(err.message);
        }

        messageTransport().then(messageSent, onError);        
    }
    
    handleMessageFileChanged = evt => {
        this.setState({messageFilePath: evt.target.value, messageFile: evt.target.files.length > 0?evt.target.files[0]: null});
        console.log(evt.target.files);
    }
    handleMessageTextChanged = evt => {
        this.setState({messageText: evt.target.value});
    }
    handleMessageTypeChanged = evt => {
        this.setState({messageType: evt.target.value});
    }

    renderMessageInput(){
        if(this.state.messageType == "TEXT"){
            return (
                <TextField value={this.state.messageText} onChange={this.handleMessageTextChanged} multiline fullWidth/>
            );
        }else{
            return (
                <input type="file" accept="audio/*" value={this.state.messageFilePath} onChange={this.handleMessageFileChanged}/>
            );
        }
        
    }
    render(){
        const { classes } = this.props;
        const { room } = this.state;

        if(_.isNil(room)){
            return (
                <CircularProgress className={classes.progress} />
            );
        }

        if(_.isNil(room.id)){
            warningRouter.pushWarning("Room Not Found");
            return (<Redirect to="/" />);
        }
        return(
            <div>
            <Card className={classes.card}>
                <CardHeader
                     avatar={
                        <Avatar className={classes.avatar}>
                        {
                            room.roomType == "ONLINE"?
                            (<OnlineIcon />):
                            (<OfflineIcon />)
                        }
                        </Avatar>
                      }
                    title={room.roomName}
                    subheader={toFullFormattedDateTimeStr(room.meetingTime)}
                    classes={{
                        title: classes.title
                    }}
                />
                <CardContent>
                    <List>
                        <ListItem divider>
                            <ListItemText primary="Room Owner"/>
                            <Avatar>
                                {room.userDict[room.ownerId].username}
                            </Avatar>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Participant(s)"/>
                        </ListItem>                        
                    </List>
                    <AvatarList users={room.userIds.map(id => (room.userDict[id]))} rowSize={5} /> 
                </CardContent>
            </Card>
            <Typography variant="headline" gutterBottom>
                Conversation
            </Typography>
            {
                room.chatRecord.length > 0?
                room.chatRecord.map(chat => (
                        <Card key={chat.id} className={classes.card} style={{marginTop:30}}>
                            <CardHeader
                                avatar={
                                    <Avatar className={classes.avatar}>
                                        {room.userDict[chat.sender].username}
                                    </Avatar>
                                }
                                title={room.userDict[chat.sender].username}
                                subheader={toFullFormattedDateTimeStr(chat.timestamp)}
                                classes={{
                                    title: classes.title
                                }}
                            />
                            <CardContent>
                                {
                                    chat.messageType == "TEXT"?
                                    (<TextIcon />):
                                    (<RecordIcon />)
                                }
                                {"   "+chat.content}
                            </CardContent>
                        </Card>
                )):
                (
                    <Card className={classes.card} style={{marginTop:30}}>
                        <CardContent>
                            There is no conversation yet.
                        </CardContent>
                    </Card>
                )
            }
            <Modal innerRef={ref => {this.modal = ref}}>
                <Typography variant="headline" gutterBottom style={{marginBottom:20}}>
                    New Message
                </Typography>
                <form onSubmit={this.newMessage}>
                    <Grid container spacing={24}>
                            <Grid item xs={4} sm={4}>
                            <NativeSelect
                                className={classes.selectEmpty}
                                value={this.state.messageType}
                                name="messageType"
                                onChange={this.handleMessageTypeChanged}
                            >
                                <option value={"TEXT"}>Text</option>
                                <option value={"SPEECH"}>Speech</option>
                            </NativeSelect>
                            </Grid>
                            <Grid item xs={8} sm={8}>
                                {this.renderMessageInput()}
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <div align="center">
                                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                        Send
                                    </Button>
                                </div>
                            </Grid>
                    </Grid>
                </form>
            </Modal>
            <FloatingButton onClick={() => this.modal.handleOpen()}>
                <AddIcon />
            </FloatingButton>
            </div>
        )
    }


}

RoomPage.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};
  
export default withStyles(styles)(RoomPage);