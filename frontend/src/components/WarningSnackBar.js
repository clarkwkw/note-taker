import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import warningRouter from '../utils/warningRouter'

const styles = theme => ({
})

class WarningSnackBar extends React.Component{
    messageQueue = []
    state = {
        snackbarOpen: false,
        snackbarMessage: ""
    }

    constructor(props){
        super(props);
        warningRouter.addConsumer(this.onMessagePushed.bind(this));
    }
    
    onMessagePushed(message){
        this.messageQueue.push(message);
        this.popMessage();
    }

    popMessage(){
        if(!this.state.snackbarOpen && this.messageQueue.length > 0){
            this.setState({snackbarOpen: true, snackbarMessage: this.messageQueue.pop()});
        }
    }

    handleSnackBarClose(){
        this.setState({snackbarOpen: false, snackbarMessage: ""});
        this.popMessage();
    }

    render(){
        const { classes } = this.props;
        const { snackbarOpen, snackbarMessage } = this.state;

        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbarOpen}
                onClose={this.handleSnackBarClose.bind(this)}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{snackbarMessage}</span>}
                action={[
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleSnackBarClose.bind(this)}
                    >
                    <CloseIcon className={classes.icon} />
                    </IconButton>
                ]}
            />
        );
    }
}

export default withStyles(styles)(WarningSnackBar);