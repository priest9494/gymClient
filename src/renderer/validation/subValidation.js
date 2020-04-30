import dateValidation from './dateValidation'

export default async function(gridNode, isEditOperation) {
    var isCorrect = true
    var alertMessage = ''
    //Номер абонемента:
        
    if(!gridNode.subNumber) {
        alertMessage += '• Введите номер абонемента\n'
        isCorrect = false
    } else if(gridNode.subNumber.length > 13) {
        alertMessage += '• Слишком длинный номер абонемента\n'
        isCorrect = false
    }

    // Клиент
    if(!gridNode.client) {
        alertMessage += '• Выберите клиента\n'
        isCorrect = false
    }
    
    // Вид абонемента
    if(!gridNode.type) {
        alertMessage += '• Выберите вид абонемента\n'
        isCorrect = false
    }
    // Тренер
    if(!gridNode.trainer) {
        alertMessage += '• Выберите тренера\n'
        isCorrect = false
    }

    // Дата начала
    if(!gridNode.begDate) {
        alertMessage += '• Введите дату начала\n'
        isCorrect = false
    } else if(gridNode.begDate && !dateValidation(gridNode.begDate)) {
        alertMessage += '• Дата начала не соответствует формату (дд.мм.гггг)\n'
        isCorrect = false
    } else if(gridNode.endDate && gridNode.begDate > gridNode.endDate) {
        alertMessage += '• Дата начала не может быть больше даты окончания\n'
        isCorrect = false
    }
    // Дата окончания
    if(!gridNode.endDate) {
        alertMessage += '• Введите дату окончания\n'
        isCorrect = false
    } else if(!dateValidation(gridNode.endDate)) {
        alertMessage += '• Дата окончания не соответствует формату (дд.мм.гггг)\n'
        isCorrect = false
    }
    // Время начала
    var timeReg = /([0-1][0-9]|2[0-3])([:])([0-5][0-9])/gi
    var regRes = String(gridNode.begTime).match(timeReg)
    if(gridNode.begTime && !regRes) {
        alertMessage += '• Время не соответсвует формату (чч:мм)\n'
        isCorrect = false
    } else {
        gridNode.begTime = regRes
    }
    // Примечание
    if(gridNode.note > 200) {
        alertMessage += '• Слишком длинное примечание (чч:мм)\n'
        isCorrect = false
    }
    
    if(isEditOperation) {
        var trainLeftInt = parseInt(gridNode.trainLeft)
        var payLeftInt = parseInt(gridNode.payLeft)

        if(!gridNode.payLeft === '') {
            alertMessage += "• Заполните поле 'Осталось оплатить'\n"
            isCorrect = false
        } else if(isNaN(payLeftInt) || payLeftInt < 0 || payLeftInt > 2000000000) {
            alertMessage += "• Некорректное значение поля 'Осталось оплатить'\n"
            isCorrect = false
        }

        if(gridNode.trainLeft === '') {
            alertMessage += "• Заполните поле 'Осталось занятий'\n"
            isCorrect = false
        } else if(isNaN(trainLeftInt) || trainLeftInt < 0 || trainLeftInt > 30000) {
            alertMessage += "• Некорректное значение поля 'Осталось занятий'\n"
            isCorrect = false
        }
    }

    if(isCorrect) {
        fillSpaces(gridNode)
    }
    return { isCorrect, alertMessage }
}

// Автозаполнение пустых необязательных полей
const fillSpaces = function(gridNode) {
    if(!gridNode.note) {
        gridNode.note = '-'
    }
    if(!gridNode.begTime) {
        gridNode.begTime = '00:00'
    }
}