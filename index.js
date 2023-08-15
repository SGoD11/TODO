import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
const app = express();
const port = 3000;
const array = [];
const warray = [];
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/", function (req, res) {
    try {

        res.render("index.ejs");
    } catch (error) {
        console.log(error);
    }
});

app.post('/createTask', (req, res) => {
    //taking data
    const task = req.body["newTask"];
    console.log(task);
    //displaying and saving

    array.push(task);
    console.log(array);
    //crossing the strikethrough 
    fs.writeFile("data.txt", array.toString(), (err) => {
        if (err) throw err;
    });
    let readAbale = fs.readFile("./data.txt", 'utf8', (err, data) => {
        if (err) throw err;
        return data;
    });
    res.render("index.ejs",{
        display: array,
    });
});



//for work
app.get("/work", function (req, res) {
    // res.send("hello this is the work and it will be different");
    try {

        res.render("index2.ejs");
    } catch (error) {
        console.log(error);
    }

});
//for workTask
app.post('/work', (req, res) => {
    //taking data
    const task = req.body["newTask"];
    console.log(task);
    //displaying and saving

    warray.push(task);
    console.log(warray);
   

    // Send a response to the client
    res.render("index2.ejs", {
        display: warray,
    });
});



app.listen(port, function () {
    console.log(`Listening at port : ${port}`);
});



