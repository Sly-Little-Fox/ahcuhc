const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const home = require('os').homedir();
const directoryPath = path.join(home, 'AppData', 'Local', '{2KFlBIxZE79fDMWxoKEr}');
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.log('Unable to scan directory: ', err);
  }
  files.forEach((file) => {
    const hash = crypto.createHash('sha1');
    const input = fs.createReadStream(file);
    input.on('readable', () => {
      const data = input.read();
      if (data)
        hash.update(data);
      else {
        if(hash.digest('hex') === 'c9ab0ba1d92e2f755301ef975c0990fcdb321805') {
          console.log(`Found Chucha in ${file}!`);
        }
      }
    });
  });
});