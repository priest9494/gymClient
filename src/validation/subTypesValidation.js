export default function(gridNode) {
    var isCorrect = true
    var alertMessage = ''

    var costInt = parseInt(gridNode.cost)
    var trainingInt = parseInt(gridNode.training)

    if(gridNode.title.length === 0) {
        alertMessage += '• Введите наименование\n'
        isCorrect = false
    }

    if(gridNode.title.length > 50) {
        alertMessage += '• Слишком длинное наименование\n'
        isCorrect = false
    }

    if(gridNode.cost.length === 0) {
        alertMessage += '• Введите стоимость\n'
        isCorrect = false
    } else if(isNaN(costInt) || costInt < 0 || costInt > 2000000000) {
        alertMessage += '• Некорректная стоимость\n'
        isCorrect = false
    }

    if(gridNode.training.length === 0) {
        alertMessage += '• Введите количество занятий\n'
        isCorrect = false
    } else if(isNaN(trainingInt) || trainingInt < 0 || trainingInt > 30000) {
        alertMessage += '• Некорректное количество занятий\n'
        isCorrect = false
    }

    return { isCorrect, alertMessage }
}