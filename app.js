const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const newListItems = ['Eat', 'Code', 'Sleep'];
const workItems = [];

app.get("/", (req, res) => {
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: newListItems });
});

app.post("/", (req, res) => {
    if ((x = req.body.newItem) !== "") {
        if (req.body.list === 'Work List') {
            workItems.push(x);
            res.redirect("/work");
        } else {
            newListItems.push(x);
            res.redirect("/");
        }
    }
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", (req, res) => {
    res.redirect("/work");
});

app.get("/about", (req, res)=>{
    res.render("about", {listTitle: "About Me"});
});

app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});