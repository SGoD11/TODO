import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import fs from "fs";
const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { autoIndex: false });

//schema
const itemsSchema = {
    name: String
};
//model
const Item = mongoose.model("Item", itemsSchema);
const Work = mongoose.model("Work",itemsSchema);
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
const defaultItems = [Item1,Item2,Item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

//just for storing the value of the inserted items or docs
const foundItems = await Item.find();
const workItems = await Work.find();


// console.log("Thers is the found items in upper part", foundItems);



// starting from here
app.get("/",  async function (req, res) {
    
        
        if (foundItems.length === 0) {
            // const defaultItems = [Item1, Item2, Item3];
            // Item.insertMany(defaultItems);
            //to read data
            
            console.log("If part is on the go");
            res.render("index.ejs");

        }
        else {
            //for reading data
            const finalFound = await Item.find();
            // console.log("Final found", finalFound);
            // console.log("Thers is the found items in else part", foundItems);
            res.render("index.ejs", {
                display: finalFound,
            });
        }

        
    } 
);

app.post('/createTask', async (req, res) => {
    //taking data
    const task = req.body["newTask"];
    console.log("this is task", task);
    //displaying and saving
    const item = new Item({
        name: task
    });
    item.save();

    //reading items
    const itemsFoun = await Item.find()
    console.log("This is the for each loop");
    itemsFoun.forEach(element => {
        console.log("For each loop ->", element.name);
    });
    //crossing the strikethrough 

    res.render("index.ejs",{
        display: itemsFoun
    });
});

//for deleting items
app.post("/delete",async(req,res)=>{
    // console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    console.log("Item id is = ",checkedItemId);
    try {
        await Item.findByIdAndRemove(checkedItemId);
        console.log("Successfully deleted");
    } catch (error) {
        console.log("There was an interrupt\n",error);
    }
    setTimeout(() => {
        res.redirect("/");
      }, "1000");
    
});



//for work
app.get("/work", async function (req, res) {
    // res.send("hello this is the work and it will be different");
    try {
        if(workItems.length === 0){

            console.log("If work undergoing");
            res.render("index2.ejs");

        }else{
            //to insert the latest value and display it
            const workFound = await Work.find();
            console.log("Work founded --> \n",workFound);
            res.render("index2.ejs", {
                display: workFound,
            });
        }
    } catch (error) {
        console.log(error);
    }

});
//for workTask
app.post('/work', async (req, res) => {
    //taking data
    const task = req.body["newTask"];
    console.log(task);
    //displaying and saving

    const work = new Work({
        name: task
    });
    work.save();
    const itemsFoun = await Work.find()
    console.log("This is the for each loop");


    // Send a response to the client
    res.render("index2.ejs",{
        display:itemsFoun
    });
});

//for deleting works
app.post("/deleteWork",async(req,res)=>{
    // console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    console.log("Item id is = ",checkedItemId);
    try {
        await Work.findByIdAndRemove(checkedItemId);
        console.log("Successfully deleted");
    } catch (error) {
        console.log("There was an interrupt\n",error);
    }
    setTimeout(() => {
        res.redirect("/work");
      }, "1000");
    
});

//time for urls customs
app.get("/:paraname",async (req,res)=>{
    console.log(req.params.paraname);
    const customListName = req.params.paraname;
    
       
        const query = List.where({ name: customListName });
        const TheItem = await query.findOne();
        
        if(TheItem.name == customListName){
            console.log("Exists");
            //show existing list
            res.render("list.ejs",{
                header: customListName,
                display: TheItem.items,
            });
            console.log(TheItem.items);
        }
        else{

            console.log("Doesn't exists");
            //create a list
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/"+customListName);
        }
        // console.log(TheItem.name); --> name of customlist name
});

//for online of the port
app.listen(port, function () {
    console.log(`Listening at port : ${port}`);
});



