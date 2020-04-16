import dateValidation from './dateValidation'

export default function(begRange, endRange) {
    var isCorrect = true

    if(begRange && !dateValidation(begRange)) {
        isCorrect = false
    }

    if(endRange && !dateValidation(endRange)) {
        isCorrect = false
    }

    return isCorrect
}