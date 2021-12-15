const express = require('express');
const path = require('path');
const fsPromises = require('fs/promises');
const os = require('os');
const fs = require('fs');

const app = express();
app.use(express.json());

const homeDir = os.homedir();
let finalDirectory = path.join(homeDir, 'fileSysTask')

// Post request to create a folder in home directory
app.post("/api/filesys", async function (req, res) {
    try {

        // Replacing the colon with the "" in the time format  
        let dt = new Date();
        let stamp = dt.toString();
        let time = dt.toTimeString();
        time = time.split(":").join("").split(" ").slice(0, 1).join("");

        // Replacing the slash with hypen in the date format
        let date = dt.toLocaleDateString();
        for (i = 0; i < date.length; i++) {
            if (date[i] === '/') {
                date = date.replace('/', '-')
            }
        }

        
        let fileName = date + '-' + time;

        // Checking the Directory existing if not existed it will create a directory
        fs.open(finalDirectory, async (err, fd) => {
            if (err) {
                await fsPromises.mkdir(finalDirectory, (err) => {
                    console.log(err)
                })
                await fsPromises.writeFile(`${finalDirectory}\\${fileName}.txt`, stamp, { flag: 'a+' }) // and creating a file and writing the file wiht timestamp
            } else if (fd) {
                
                await fsPromises.writeFile(`${finalDirectory}\\${fileName}.txt`, stamp, { flag: 'a+' }) // and creating a file and writing the file wiht timestamp
                fs.close(fd, (err) => {
                    console.log(err)
                })
            }
        })

        res.send({
            message: "Scessfull"
        })

    } catch (error) {
        res.status(404).json({
            errors: error
        })
        console.log(error)
    }
})

// Get request to get the details of the files created in home directory
app.get("/api/fetchFiles", async function (req, res) {
    try {
        let a = await fsPromises.readdir(finalDirectory)
        console.log(a);
        res.json(a)
    } catch (error) {
        console.log(error)
    }
})

let port = process.env.PORT;

app.listen(port, () => {
    console.log("app is listening");
})