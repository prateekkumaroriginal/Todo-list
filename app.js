const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB").then(() => console.log('connected')).catch(e => console.log(e));


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});
const Item = new mongoose.model('Item', itemSchema);

defaultItems = [
    { name: "Welcome to your Todo List" },
    { name: "Hit '+' button to add a new item" },
    { name: "<--Hit this to check" },
];

const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    items: [itemSchema]
});
List = mongoose.model('List', listSchema);


app.get("/", (req, res) => {
    Item.find({}).then(foundItems => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(() => {
                res.redirect("/");
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    if (req.body.newItem !== "") {
        const item = new Item({
            name: itemName
        });

        if (listName == "Today") {
            item.save();
        } else {
            List.findOne({ name: listName }).then((foundList) => {
                foundList.items.push(item);
                foundList.save();
            }).catch((err) => { console.log(err); });
        }
    }
    res.redirect('back');
});

app.get("/:customListName", (req, res) => {
    customListName = req.params.customListName;

    List.findOne({ name: customListName })
        .then((foundList) => {
            if (foundList) {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
            } else {
                List.create({
                    name: customListName,
                    items: defaultItems,
                });
                res.redirect("/" + customListName);
            }
        })
        .catch((e) => { console.log('Error: ' + e); });

});

app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    Item.deleteOne({ _id: itemId }).then(() => {
        res.redirect("back");
    }).catch(e => console.log(e));
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