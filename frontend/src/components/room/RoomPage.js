import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'; 

import { Redirect } from 'react-router';
import { Avatar, Card, CardContent, CardHeader, CircularProgress, FloatingButton, List, ListItem, ListItemText, Typography} from '@material-ui/core';
import AddRoomMessageModal from './AddRoomMessageModal';
import AvatarList from './AvatarList';
import { Add as AddIcon, GroupRounded as OfflineIcon, ComputerRounded as OnlineIcon, RecordVoiceOver as RecordIcon, Note as TextIcon } from '@material-ui/icons'

import { toFullFormattedDateTimeStr } from '../../utils/date';
import warningRouter from '../../utils/warningRouter';
import { getRoom } from '../../transport/room';

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
    },
    progress: {
        margin: theme.spacing.unit * 2,
      }
  });
  
const ChatContent = withStyles(styles)((props) => {
    const{ chat, classes } = props;

    if(chat.messageType == "TEXT"){
        return (
            <div>
                <TextIcon />{"   "+chat.content}
            </div>
        )
    }else{
        if(!chat.recognizing){
            return (
                <div>
                    <RecordIcon />{"   "+chat.content}
                </div>
            )
        }else{
            return(
                <div>
                    <RecordIcon /><CircularProgress className={classes.progress} />
                </div>
            )
        }
    }
})

class RoomPage extends React.Component{
    state = {
        room: null,
        messageText: "",
        messageType: "TEXT",
        messageFilePath: "",
        messageFile: null
    }
    modal = null
    recognizingMessagesMonitor = null

    constructor(props){
        super(props);
        this.fetchRoom();
    }

    fetchRoom = async () => {
        let room = await getRoom(this.props.id);
        this.setState({ room: room });
        this.recognizingMessages = [];
        if(!_.isNil(this.recognizingMessagesMonitor)){
            clearInterval(this.recognizingMessagesMonitor);
        }
        room.chatRecord.forEach(chat => {
            if(chat.recognizing)this.recognizingMessages.push(chat.id);
        })
        if(this.recognizingMessages.length > 0){
            this.recognizingMessagesMonitor = setInterval(() => this.fetchRoom(), 10000);
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
                                <ChatContent chat={chat} className={classes} />
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

            <FloatingButton onClick={() => this.modal.handleOpen()}>
                <AddIcon />
            </FloatingButton>
            <AddRoomMessageModal roomId={room.id} onMessageSent={this.fetchRoom} innerRef={ref => {this.modal = ref}} />
            </div>
        )
    }

}

RoomPage.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};
  
export default withStyles(styles)(RoomPage);