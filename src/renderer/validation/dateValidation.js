export default function(dateString) {
    var dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/

    if(dateString.match(dateReg) === null) {
        return false
    }
    return true
}