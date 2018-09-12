import * as queryString from 'query-string';
import { history } from '../routes';
import { HOST } from '../constants/backend';
import * as _ from 'lodash';

async function helper(path, method, options, func){
  console.log(options);
  let res = await fetch(HOST + path, _.merge({ method }, options));
  if (res.status === 403 || res.status === 401) {
    history.push('/login');
    delete localStorage.token;
  }
  let result = await res.json();
  func && func(result);
  return result;
}

export const get = async (path, payload = {}) => await helper(
    `${path}?${queryString.stringify(payload)}`, 
    'GET',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}` 
      }
    }
  );
  
  // function for sending POST request
  export const post = async (path, payload) => await helper(path, 'POST', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.token}`
    },
    body: JSON.stringify(payload)
  });
  
  // function for sending DELETE request
  export const del = async (path, payload) => await helper(path, 'DELETE', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.token}`
    },
    body: JSON.stringify(payload)
  });
  
  // function for sending PATCH request
  export const patch = async (path, payload) => await helper(path, 'PATCH', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.token}` 
    },
    body: JSON.stringify(payload)
  });
  
  // function for sending LOGIN POST request
  export const login = async ({ username, password }) => await helper('/auth/login', 'POST', {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  }, (result) => {
    if(!_.isNil(result.token)){
      localStorage.token = result.token;
    }else{
      delete localStorage.token;
      throw new Error("LoginFailedError");
    }
  });