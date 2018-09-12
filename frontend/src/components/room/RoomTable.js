import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { getRooms } from '../../transport/room';
import { toShortFormattedDateTimeStr } from '../../utils/date';
import { RoundedRectangle } from '../../material/RoundedRectangle';
import { history } from '../../routes';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
  },
};

class RoomTable extends React.Component{
  state = {
    rooms: []
  }

  constructor(props){
    super(props);
    this.fetchRooms();
  }

  fetchRooms = async () => {
    let rooms = await getRooms();
    this.setState({ rooms });
  }

  render(){
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Room Name</TableCell>
              <TableCell>Meeting Time</TableCell>
              <TableCell>Meeting Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rooms.map(room => {
              return (
                <TableRow key={room.id} onClick={(e)=>{history.push("/room/"+room.id)}} hover>
                  <TableCell component="th" scope="row">
                    {room.roomName}
                  </TableCell>
                  <TableCell>{toShortFormattedDateTimeStr(room.meetingTime)}</TableCell>
                  <TableCell>
                    <RoundedRectangle background="lightgreen">{room.roomType}</RoundedRectangle>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

RoomTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoomTable);