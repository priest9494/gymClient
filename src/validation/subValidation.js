import dateValidation from './dateValidation'

export default function(gridNode) {
    var isCorrect = true
    var alertMessage = ''
    //Номер абонемента:
            // проверить уникальность
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
        alertMessage += '• Дата не соответствует формату (дд.мм.гггг)\n'
        isCorrect = false
    } else if(gridNode.endDate && gridNode.begDate > gridNode.endDate) {
        alertMessage += '• Дата начала не может быть больше даты окончания\n'
        isCorrect = false
    }
        // Формат
        // Меньше даты окончания
    // Дата окончания
    if(!gridNode.endDate) {
        alertMessage += '• Введите дату окончания\n'
        isCorrect = false
    }
        // Формат
    // Время начала
    var timeReg = /([0-1][0-9]|2[0-3])([:])([0-5][0-9])/gi
    var regRes = String(gridNode.begTime).match(timeReg)
    if(!regRes) {
        alertMessage += '• Время не соответсвует формату (чч:мм)\n'
        isCorrect = false
    } else {
        gridNode.begTime = regRes
    }
        // Формат
    // Примечание
        // Длина

    if(isCorrect) {
        fillSpaces(gridNode)
    }
    return {isCorrect, alertMessage}
}

const fillSpaces = function(gridNode) {
    if(!gridNode.note) {
        gridNode.note = '-'
    }
    if(!gridNode.begTime) {
        gridNode.begTime = '00:00:00'
    }
}