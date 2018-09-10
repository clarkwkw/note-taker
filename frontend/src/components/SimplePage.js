import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import dashboardStyle from '../material/dashboardStyle';

function SimplePage(props){
	const { classes, heading } = props;
	return(
		<div className={classes.appBarSpacer}>
			<Typography variant="display1" gutterBottom>
	            {heading}
	        </Typography>
	        <div className={classes.tableContainer}>
	           { props.children }
	        </div>
        </div>
    );
}

SimplePage.propTypes = {
  classes: PropTypes.object.isRequired,
  heading: PropTypes.string.isRequired,
};

export default withStyles(dashboardStyle)(SimplePage);