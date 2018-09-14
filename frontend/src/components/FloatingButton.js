import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'; 
import Button from '@material-ui/core/Button';

const styles = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        left: 'auto',
        bottom: 20,
        right: 20,
        position: 'fixed'
    }
})

class FloatingButton extends React.Component{
    render(){
        const { classes } = this.props;
        return(
            <Button variant="fab" color="primary" aria-label="button" className={classes.fab} {...this.props}>
                {this.props.children}
            </Button>
        );
    }
}

FloatingButton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FloatingButton);