import dateValidation from './dateValidation'

export default function(bDate, eDate, begDateUpdated, endDateUpdated) {
    var isCorrect = true
    var alertMessage = ''
    var begDateToValidate = bDate ? bDate : begDateUpdated
    var endDateToValidate = eDate ? eDate : endDateUpdated

    if(!dateValidation(begDateToValidate)) {
        isCorrect = false
        alertMessage += '• Дата начала не соответствует формату (дд.мм.гггг)\n'
    }

    if(!dateValidation(endDateToValidate)) {
        isCorrect = false
        alertMessage += '• Дата окончания не соответствует формату (дд.мм.гггг)\n'
    }

    return { isCorrect, alertMessage, begDateToValidate, endDateToValidate }
}