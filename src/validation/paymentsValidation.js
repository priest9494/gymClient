import dateValidation from './dateValidation'

export default function(gridNode) {
    var isCorrect = true
    var alertMessage = ''

    if(!gridNode.subNumber) {
        alertMessage += '• Введите номер абонемента\n'
        isCorrect = false
    } else if(gridNode.subNumber.length > 13) {
        alertMessage += '• Слишком длинный номер абонемента\n'
        isCorrect = false
    }

    if(!gridNode.paymentDate) {
        alertMessage += '• Введите дату оплаты\n'
        isCorrect = false
    } else if(!dateValidation(gridNode.paymentDate)) {
        alertMessage += '• Дата оплаты не соответствует формату (дд.мм.гггг)\n'
        isCorrect = false
    }
    
    if(!gridNode.paymentAmount) {
        alertMessage += '• Введите сумму оплаты\n'
        isCorrect = false
    } else if (gridNode.paymentAmount < 0 || gridNode.paymentAmount > 2000000000) {
        alertMessage += '• Некорректная сумма оплаты\n'
        isCorrect = false
    }

    if(!gridNode.paymentMethod) {
        alertMessage += '• Введите сумму оплаты\n'
        isCorrect = false
    } else if (gridNode.paymentMethod.length > 3) {
        alertMessage += "• Слишком длинный способ оплаты (может быть 'нал' или 'б/н')\n"
        isCorrect = false
    }

    return { isCorrect, alertMessage }
}