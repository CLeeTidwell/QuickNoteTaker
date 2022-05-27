//load dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3001;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
//route to path
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/db'));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get("/api/notes", (req,res)=>{

    readFileAsync("./db/db.json", "utf8")
    .then((notes, err)=>{
        if(err) console.log(err);       
        return res.json(JSON.parse(notes));       
    });     
});

//
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.post("/api/notes"), (req, res) => {
    let newNote = req.body
    readFileAsync("./db/db.json", "utf8")
        .then((result, err) => {
            if (err) console.log(err);
            return res.json(result);
        })
        .then(data => {
            newNote.id = getLastIndex(data) + 1;
            (data.length > 0) ? data.push(notes): data = [newNote];
            return Promise.resolve(data);
        }).then(data => {
            //write the new file
            writeFileAsync("./db/db.json", JSON.stringify(data));
            res.json(newNote);
        })
        .catch(err => {
            if (err) throw err;
        });

}

app.delete("/api/notes/:id", (req, res) => {
    let selected = req.params.id;

    for (var i = 0; i < notes.length; i++) {
        if (selected === notes[i].id)
            notes.splice([i], 1)
    }
    return res.json(notes)
});


// gets last id used
function getLastIndex(data) {
    if (data.length > 0) return data[data.length - 1].id;
    return 0;
}
// starts the server
app.listen(PORT, function () {
    console.log(`Listening on PORT ${PORT}`);
});