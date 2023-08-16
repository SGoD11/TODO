import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import fs from "fs";
const app = express();
const port = 3000;

const array = [];
const warray = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { autoIndex: false });

//schema
const itemsSchema = {
    name: String
};
//model
const Item = mongoose.model("Item", itemsSchema);

//documents
const Item1 = new Item({
    name: "Hello There To add Items Click on the + Button"
});
const Item2 = new Item({
    name: "Make Items Of Necessary Work"
});
const Item3 = new Item({
    name: "The Work That Is Very Important And Takes Time To Complete"
});




const foundItems = await Item.find();
console.log("Thers is the found items in upper part", foundItems);
// starting from here
app.get("/",  async function (req, res) {
    try {
        
        if (foundItems.length === 0) {
            const defaultItems = [Item1, Item2, Item3];
            Item.insertMany(defaultItems);
            //to read data
            
            
            res.redirect("/");

        }
        else {
            const finalFound = await Item.find();
            console.log("Final found", finalFound);
            console.log("Thers is the found items in else part", foundItems);
            res.render("index.ejs", {
                display: finalFound,
            });
        }

        
    } catch (error) {
        console.log(error);
    }
});

app.post('/createTask', (req, res) => {
    //taking data
    const task = req.body["newTask"];
    console.log("this is task", task);
    //displaying and saving
    const item = new Item({
        name: task
    });
    item.save();
    
    console.log("This is the for each loop");
    foundItems.forEach(element => {
        console.log("For each loop ->", element.name);
    });
    //crossing the strikethrough 

    res.redirect("/");
});



//for work
app.get("/work", function (req, res) {
    // res.send("hello this is the work and it will be different");
    try {

        res.render("index2.ejs", {
            display: warray,
        });
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
    res.redirect("/work");
});


//for online of the port
app.listen(port, function () {
    console.log(`Listening at port : ${port}`);
});



