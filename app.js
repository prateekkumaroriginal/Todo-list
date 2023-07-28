const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

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
            res.render("list", { listTitle: "Today", ListItems: foundItems });
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

app.get("/all-lists/:customListName", (req, res) => {
    customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then((foundList) => {
            if (foundList) {
                res.render("list", { listTitle: foundList.name, ListItems: foundList.items });
            } else {
                res.render("404")
            }
        })
        .catch((e) => { console.log('Error: ' + e); });

});

app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({ _id: itemId }).then(() => {
            res.redirect("back");
        }).catch(e => console.log(e));
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemId } } }).then((foundList) => {
            res.redirect("back");
        }).catch((err) => { console.log(err); });
    }
});

app.post("/deleteList", (req, res)=>{
    const listId = req.body.listId;
    List.deleteOne({_id: listId}).then((result)=>{
        res.redirect("back");
    }).catch((err)=>{
        console.log(err);
    })
})

app.get("/about", (req, res) => {
    res.render("about", { listTitle: "About Me" });
});

app.get("/all-lists", (req, res) => {
    List.find({}).then((foundLists) => {
        res.render("all-lists", { pageTitle: "All Lists", foundLists: foundLists });
    });
});

app.get("/create", (req, res) => {
    res.render("create", {listAlreadyExists: false});
});

app.post("/create", (req, res) => {
    const newList = _.capitalize(req.body.newList);
    List.findOne({ name: newList }).then((foundList) => {
        if (foundList) {
            res.render("create", {listAlreadyExists: true, listName: newList});
        } else {
            List.create({
                name: newList,
                items: defaultItems,
            }).then(() => {
                res.redirect("/all-lists/" + newList);
            });
        }
    })
});

app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});