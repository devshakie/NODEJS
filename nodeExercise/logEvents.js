const { v4: uuidv4 } = require('uuid'); 
const { format } = require("date-fns");
const fs = require('fs').promises;
const path = require('path'); 

const logEvents = async (message) => {
  const date = format(new Date(), "yyyy-MM-dd");
  const logItem = `{${date} - ${uuidv4()} - ${message}}\n`; 

  try {
    const folderPath = path.join(__dirname, 'logs');

    //if the folder exists, if not, create it
    if (!await fs.access(folderPath).then(() => true).catch(() => false)) {
      await fs.mkdir(folderPath);
    }

    // Append the log item to the file 'eventLogs.txt'
    const filePath = path.join(folderPath, 'eventLogs.txt');
    await fs.appendFile(filePath, logItem);
    console.log('Log written:', logItem);
  } catch (err) {
    console.error('Error writing to file', err);
  }
};

module.exports = logEvents;
