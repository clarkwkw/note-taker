import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AvatarList from './AvatarList';
import ChangeParticipantIcon from 'mdi-material-ui/AccountSearch';

const styles = theme => ({
});

class ParticipantBox extends React.Component{
    state = {
        userObjs: {},
        userSeq: []
    }
    constructor(props){
        super(props);
        props.includeUsers.forEach(user => {
            this.state.userSeq.push(user.id);
            this.state.userObjs[user.id] = user;
        });
        this.valueListener = props.valueListener || ((userIds) => {});
    }

    render(){
        const { classes } = this.props;

        return (
            <div>
                    <Grid container spacing={24} alignItems="flex-end">
                            <Grid item>
                                <ChangeParticipantIcon />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="addParticipant"
                                    label="Add participant"
                                    name="addParticipant"
                                    fullWidth
                                />
                            </Grid>
                    </Grid>
                <AvatarList users={this.state.userSeq.map(userId => this.userObjs[userId])} rowSize={5} border />
            </div>
        );
    }
}

ParticipantBox.propTypes = {
    classes: PropTypes.object.isRequired,
    includeUsers: PropTypes.array.isRequired,
    valueListener: PropTypes.func
};
  
export default withStyles(styles)(ParticipantBox);