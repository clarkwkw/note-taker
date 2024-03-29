import React from 'react';
import { Route } from 'react-router-dom';
import SimplePage from './components/SimplePage';
import RoomTable from './components/room/RoomTable';
import { createBrowserHistory } from 'history';
import RoomPage from './components/room/RoomPage';
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage';
import NewRoom from './components/room/NewRoom';

const history = createBrowserHistory();

const Routes = (superProps) => {
  return(
  <div>
    <Route exact path="/login" render={(props) => ( 
    	  <SimplePage heading='Welcome Back!'>
          <LoginPage />
        </SimplePage>
    )} />

    <Route exact path="/register" render={(props) => ( 
    	  <SimplePage heading='Register'>
          <RegisterPage />
        </SimplePage>
    )} />

    <Route exact path="/" render={(props) => ( 
    	<SimplePage heading='Your Rooms'>
        <RoomTable />
      </SimplePage>
    )} />

    <Route exact path="/newRoom" render={(props) => ( 
    	<SimplePage heading='New Room'>
        <NewRoom />
      </SimplePage>
    )} />

    <Route path="/room/:id" render={(props) => (
      <SimplePage heading='Room Details'>
        <RoomPage id={props.match.params.id} />
      </SimplePage>
    )} />
   </div>
)};


export { history, Routes };