import moment from 'moment';

export function getCurJSTime(){
    return moment().format("YYYY-MM-DDTHH:mm")
}
export function toShortFormattedDateTimeStr(str){
    let date = new Date(str);
    let options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString("en-GB", options);
}

export function toFullFormattedDateTimeStr(str){
    let date = new Date(str);
    let options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'long' };
    return date.toLocaleString("en-GB", options);
}