const fs = require('fs')

export default function(method, data) {
    if(method === 'write') {
        return write(data)
    } else if(method === 'read'){
        return read()
    }
}

const read = function() {
    return JSON.parse(fs.readFileSync('settingsLog.json', 'utf-8'))
}

const write = function(data) {
    console.log(data)
    fs.writeFileSync('settingsLog.json', JSON.stringify(data))
    return true
}