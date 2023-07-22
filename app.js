const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB").then(() => console.log('connected')).catch(e => console.log(e));


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});
const Item = new mongoose.model('Item', itemSchema);

// Item.insertMany([
//     { name: "Welcome to your Todo List" },
//     { name: "Hit '+' button to add a new item" },
//     { name: "<--Hit this to check" },
// ]);

const workItems = [];

app.get("/", (req, res) => {
    const day = date.getDate();
    Item.find({}).then(foundItems => {
        if (foundItems.length === 0) {
            Item.insertMany([
                { name: "Welcome to your Todo List" },
                { name: "Hit '+' button to add a new item" },
                { name: "<--Hit this to check" },
            ]).then(() => {
                res.redirect("/");
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.render("list", { listTitle: day, newListItems: foundItems });
        }
    })
});

app.post("/", (req, res) => {

    if ((x = req.body.newItem) !== "") {
        const itemName = req.body.newItem;
        if (req.body.list === 'Work List') {
            workItems.push(x);
            res.redirect("/work");
        } else {
            Item.create({
                name: itemName
            });
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    Item.deleteOne({ _id: itemId }).then(() => {
        res.redirect("/");
    }).catch(e => console.log(e));
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", (req, res) => {
    res.redirect("/work");
});

app.get("/about", (req, res) => {
    res.render("about", { listTitle: "About Me" });
});

app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});