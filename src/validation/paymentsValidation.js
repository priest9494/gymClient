import dateValidation from './dateValidation'

export default function(gridNode) {
    var isCorrect = true
    var alertMessage = ''

    if(!gridNode.sub) {
        alertMessage += '• Выберите абонемент\n'
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

    return { isCorrect, alertMessage }
}