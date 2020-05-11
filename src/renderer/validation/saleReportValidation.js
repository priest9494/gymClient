export default function(validObj) {
    // Время начала
    if(validObj.time !== '') {
        var timeReg = /([0-1][0-9]|2[0-3])([:])([0-5][0-9])/gi
        var regRes = String(validObj.time).match(timeReg)

        if(!regRes) {
            return false
        }
    }

    /* if((validObj.beg === '') || (validObj.end === '')) {
        return false
    } */

    return true
}