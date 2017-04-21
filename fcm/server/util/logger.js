const fs = require('fs');
const logDir = './log';
(!fs.existsSync(logDir)) && fs.mkdirSync(logDir)


const errorLog = fs.createWriteStream('log/error.txt', {
   flags: 'a'
});
const infoLog = fs.createWriteStream('log/info.txt', {
   flags: 'a'
});
// Or 'w' to truncate the file every time the process starts.

const error = (msg) => {
   const timeStamp = new Date().toISOString()
   errorLog.write(timeStamp + '  ' + msg + '\n');
}
const info = (msg) => {
   const timeStamp = new Date().toISOString()
   infoLog.write(timeStamp + '  ' + msg + '\n');
}

module.exports = {
   error,
   info
}