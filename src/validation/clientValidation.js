import dateValidation from './dateValidation'

export default function(gridNode) {
    var isCorrect = true
    var alertMessage = ''

    if(gridNode.fio.length === 0) {
        alertMessage += '• Введите ФИО\n'
        isCorrect = false
    } else if(gridNode.fio.length > 100) {
        alertMessage += '• Слишком длинное ФИО\n'
        isCorrect = false
    }

    if(gridNode.phoneNum.length === 0) {
        alertMessage += '• Введите номер телефона\n'
        isCorrect = false
    } else if(gridNode.phoneNum.length > 18) {
        alertMessage += '• Слишком длинный номер телефона\n'
        isCorrect = false
    }

    if(gridNode.inviterPhone.length > 18) {
        alertMessage += '• Слишком длинный номер телефона пригласившего\n'
        isCorrect = false
    }

    if(gridNode.howToFind.length > 16) {
        alertMessage += "• Слишком длинный пункт 'Откуда узнали' \n"
        isCorrect = false
    }

    if(gridNode.note.length > 200) {
        alertMessage += "• Слишком длинное примечание \n"
        isCorrect = false
    }

    if(!gridNode.firstVisitDate) {
        alertMessage += "• Введите дату первого визита \n"
        isCorrect = false
    } else if(!dateValidation(gridNode.firstVisitDate)) {
        alertMessage += '• Дата первого визита не соответствует формату (дд.мм.гггг)\n'
        isCorrect = false
    }

    if(isCorrect) {
        fillSpaces(gridNode)
    }
    return { isCorrect, alertMessage }
}

const fillSpaces = function(gridNode) {
    if(!gridNode.howToFind) {
        gridNode.howToFind = '-'
    }

    if(!gridNode.inviterPhone) {
        gridNode.inviterPhone = '-'
    }

    if(!gridNode.note) {
        gridNode.note = '-'
    }

}