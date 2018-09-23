import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import Modal from '../Modal';

const styles = theme => ({
})

class ConferenceModal extends React.Component{
    modal = null;

    handleOpen(){
        this.modal.handleOpen();
    }

    handleClose(){
        this.modal.handleClose();
    }

    render(){
        return(
            <Modal innerRef={ref => {this.modal = ref}}>
                <Typography variant="headline" gutterBottom style={{marginBottom:20}}>
                    Audio Conference
                </Typography>
            </Modal>
        );
    }
}

ConferenceModal.propTypes = {
    classes: PropTypes.object.isRequired,
    roomId: PropTypes.string.isRequired
};

export default withStyles(styles)(ConferenceModal);