import React from 'react';
import { getRoom } from '../../transport/room';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'; 
import AvatarList from './AvatarList';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { toFullFormattedDateTimeStr } from '../../utils/date';
import OfflineIcon from '@material-ui/icons/GroupRounded';
import OnlineIcon from '@material-ui/icons/ComputerRounded';
import ImageIcon from '@material-ui/icons/Image';
import RecordIcon from '@material-ui/icons/RecordVoiceOver';
import TextIcon from '@material-ui/icons/Note';
import { Redirect } from 'react-router';
import warningRouter from '../../utils/warningRouter';

import * as _ from 'lodash';

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
        room: null
    }

    constructor(props){
        super(props);
        this.fetchRoom();
    }

    async fetchRoom(){
        let room = await getRoom(this.props.id);
        this.setState({ room: room });
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
            </div>
        )
    }


}

RoomPage.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};
  
export default withStyles(styles)(RoomPage);