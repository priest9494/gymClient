export default function(validObj) {
    var isCorrect = true
    var alertMessage = ''

    if(validObj.username === '') {
        isCorrect = false
        alertMessage += '• Введите имя пользователя\n'
    } else if(validObj.username.length > 20) {
        isCorrect = false
        alertMessage += '• Имя пользователя не может быть длиннее 20 символов\n'
    }

    if(validObj.password === '') {
        isCorrect = false
        alertMessage += '• Введите имя пользователя\n'
    } else if(validObj.password.length > 25 || validObj.password.length < 5) {
        isCorrect = false
        alertMessage += '• Пароль долен содержать от 5 до 25 символов\n'
    }

    return { isCorrect, alertMessage }
}