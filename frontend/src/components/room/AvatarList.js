import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, List, ListItem, ListItemText, Divider, Paper } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

const styles = theme => ({
    paper: {
        marginTop: 20,
        minHeight: 50

    }
})

class AvatarList extends React.Component{
    renderAvatar(user){
        return (
            <Avatar key={user.id} alt={user.username + "<" + user.email + ">"}>
                {user.username}
            </Avatar>
        );
    }

    renderRow(chunk){
        return chunk.map(user => this.renderAvatar(user));
    }
    
    render(){
        const{ classes, users, rowSize, border } = this.props;
        let rowCount = 0;
        return(
            <Paper elevation={border?1:0} className={classes.paper}>
                <List>
                    {
                        _.chunk(users, rowSize).map(chunk => (
                                <ListItem key={rowCount++}>
                                    <ListItemText primary=""/>
                                    {this.renderRow(chunk)}
                                </ListItem>
                            ))
                    }
                </List>
            </Paper>
        );
    }
}

AvatarList.propTypes = {
    classes: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    rowSize: PropTypes.number.isRequired,
    border: PropTypes.bool
}  
export default withStyles(styles)(AvatarList);