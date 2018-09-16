import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, NativeSelect, TextField, Typography } from '@material-ui/core'; 
import Modal from '../Modal';
import { addTextMessage, addSpeechMessage } from '../../transport/room';
import { validateMessage } from '../../utils/validation';
import warningRouter from '../../utils/warningRouter';

const styles = theme => ({
})

const newTextMessage = async (roomId, messageText) => {
    let validated = validateMessage(messageText);
    if(!validated.isValid)throw Error(validated.message);
    return await addTextMessage(roomId, messageText);
}

const newSpeechMessage = async (roomId, messageFile) => {
    if(_.isNil(messageFile))throw Error("File not selected");
    return await addSpeechMessage(roomId, messageFile, "en-US");
}

class AddRoomMessageModal extends React.Component{
    state = {
        messageText: "",
        messageType: "TEXT",
        messageFilePath: "",
        messageFile: null
    }
    modal = null;

    handleSubmit = evt => {
        evt.preventDefault();
        
        const messageTransport = this.state.messageType === "TEXT"?
            () => newTextMessage(this.props.roomId, this.state.messageText):
            () => newSpeechMessage(this.props.roomId, this.state.messageFile);
    
        const messageSent = () => {
            this.setState({
                messageText: "",
                messageType: "TEXT",
                messageFilePath: "",
                messageFile: null
            });
            this.handleClose();
            warningRouter.pushWarning("Message sent");
            if(_.isFunction(this.props.onMessageSent))this.props.onMessageSent();
        }
        const onError = err => {
            warningRouter.pushWarning(err.message);
        }
    
        messageTransport().then(messageSent, onError);        
    }

    handleMessageFileChanged = evt => {
        this.setState({messageFilePath: evt.target.value, messageFile: evt.target.files.length > 0?evt.target.files[0]: null});
    }
    handleMessageTextChanged = evt => {
        this.setState({messageText: evt.target.value});
    }
    handleMessageTypeChanged = evt => {
        this.setState({messageType: evt.target.value});
    }

    handleOpen(){
        this.modal.handleOpen();
    }

    handleClose(){
        this.modal.handleClose();
    }

    renderMessageInput(){
        if(this.state.messageType === "TEXT"){
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
        const{ classes } = this.props;
        return (
            <Modal innerRef={ref => {this.modal = ref}}>
                <form onSubmit={this.handleSubmit}>
                    <Typography variant="headline" gutterBottom style={{marginBottom:20}}>
                        New Message
                    </Typography>
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
        );
    }
}

AddRoomMessageModal.propTypes = {
    classes: PropTypes.object.isRequired,
    roomId: PropTypes.string.isRequired,
    onMessageSent: PropTypes.func
};
  
export default withStyles(styles)(AddRoomMessageModal);