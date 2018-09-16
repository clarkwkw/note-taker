import { validate } from 'validate.js';
import * as _ from 'lodash';
import moment from 'moment';
import path from 'path';

validate.extend(validate.validators.datetime, {
    parse: function(value, options) {
      return +moment.utc(value);
    },
    // Input is a unix timestamp
    format: function(value, options) {
      var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DDThh:mm";
      return moment.utc(value).format(format);
    }
  });
  

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
    if(password !== password2){
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

function validateMeetingTime(meetingTime){
    return constructFormattedResult(validate.single(
        meetingTime, {
            presence: true,
            datetime: {
                earliest: moment.utc().subtract(10, 'minutes'),
                message: "Cannot be in the past"
            }
        })
    );
}

function validateSpeechFilePath(filePath){
    const validExts = [".raw", ".m4a"];
    if(!validExts.includes(path.extname(filePath).toLocaleLowerCase())){
        return {
            isValid: false,
            message: "Unsupported file type"
        }
    }

    return {
        isValid: true
    }
}

function validateMessage(filePath){
    return constructFormattedResult(validate.single(
        filePath, {
            presence: true,
            length: {
                minimum: 1,
                tooShort: "Message cannot be empty"
            }

        })
    );
}

export { validateEmail, validatePassword, validateUsername, validateMeetingTime, validateSpeechFilePath, validateMessage };