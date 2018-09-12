import { login } from '../transport/rest';
import * as _ from 'lodash';
import { history } from '../routes';

class AuthStateStore{
    loggedInListeners = [];
    loggedOutListeners = [];

    constructor(){
         console.log("initing store");
    }

    login = (username, password) => {
        return new Promise((resolve, reject) => {
            login({ username, password }).then(
                () => {
                    if(this.isLoggedIn()){
                        resolve();
                        this.onLoggedIn();
                    }
                },
                (e) => {
                    reject(e);
                }
            )
        })
    }

    isLoggedIn = () => {
        return !_.isNil(localStorage.token);
    }

    logout = () => {
        delete localStorage.token;
        history.push('/login');
        this.onLoggedOut();
    }

    addLoggedInListener(func){
        this.loggedInListeners.push(func);
    }

    addLoggedOutListener(func){
        this.loggedOutListeners.push(func);
    }

    onLoggedIn = () => {

        console.log("triggering loggedin listeners");
        this.loggedInListeners.forEach(func => {
            try{
                func();
                console.log("triggered");
            }catch(e){
                console.log("onLoggedIn listener err:", e);
            }
        });
    }

    onLoggedOut = () => {
        this.loggedOutListeners.forEach(func => {
            try{
                func();
            }catch(e){
                
            }
        });
    }
}

const authStateStore = new AuthStateStore();

export { authStateStore };