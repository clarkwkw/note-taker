import {validate} from 'validate.js';
import * as _ from 'lodash';

function constructFormattedResult(result){
    return {
        isValid: _.isNil(result),
        message: result
    }
}

function validateEmail(email){
    return constructFormattedResult(validate.single(
        email, 
        {
            presence: true,
            email: {
                message: "Invalid email address"
            }
        }
    ));
}

function validatePassword(password, password2){
    if(password != password2){
        return constructFormattedResult("Password mismatch")
    }else{
        return constructFormattedResult(validate.single(
            password, {
                presence: true,
                length: {
                    minimum: 1,
                    message: "Cannot be an empty string"
                }
            })
        )
    }
}

function validateUsername(username){
    return constructFormattedResult(validate.single(
        username, {
            presence: true,
            length: {
                minimum: 1,
                message: "Cannot be an empty string"
            }
        })
    )
}

export { validateEmail, validatePassword, validateUsername };