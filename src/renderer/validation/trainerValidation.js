export default function(gridNode) {
    var isCorrect = true
    var alertMessage = ''

    if(!gridNode.fio) {
        alertMessage += '• Введите ФИО\n'
        isCorrect = false
    } else if(gridNode.fio.length > 100) {
        alertMessage += '• Слишком длинное ФИО\n'
        isCorrect = false
    }   

    var dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/
    if(!gridNode.dateBirth) {
        alertMessage += '• Введите дату рождения\n'
        isCorrect = false
    } else if(gridNode.dateBirth.match(dateReg) === null) {
        alertMessage += '• Дата не соответствует формату (дд.мм.гггг)\n'
        isCorrect = false
    }

    return { isCorrect, alertMessage }
}