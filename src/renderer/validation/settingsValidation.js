export default function(validObj) {
    let isCorrect = true
    let alertMessage = ''

    if(String(validObj.oldPass) !== String(validObj.adminPass)) {
        isCorrect = false
        alertMessage += '• Неверно введен старый пароль\n'
    } else {
        if(validObj.pass === '') {
            isCorrect = false
            alertMessage += '• Введите пароль\n'
        } else if(validObj.pass.length > 20 || validObj.pass.length < 6) {
            isCorrect = false
            alertMessage += '• Пароль должен иметь длину от 6 до 20 символов\n'
        }

        if(validObj.passRepeat === '') {
            isCorrect = false
            alertMessage += '• Введите повторение пароля\n'
        } else if(validObj.passRepeat.length > 20 || validObj.passRepeat.length < 6) {
            isCorrect = false
            alertMessage += '• Повторение пароля должно иметь длину от 6 до 20 символов\n'
        }

        if(isCorrect && (validObj.pass !== validObj.passRepeat)) {
            isCorrect = false
            alertMessage += '• Пароль и подтверждение пароля не совпадают\n'
        }
    }

    let rateInt = parseInt(validObj.rate)
    if(validObj.rate === '') {
        isCorrect = false
        alertMessage += '• Введите ставку тренера\n'
    } else if(rateInt < 0 || rateInt > 100) {
        isCorrect = false
        alertMessage += '• Ставка тренера может быть от 0 до 100\n'
    }

    return { isCorrect, alertMessage }
}