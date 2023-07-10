const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

let items = ['Eat', 'Code', 'Sleep'];

app.get("/", (req, res) => {
    const today = new Date();
    let options = { weekday: 'long', month: 'long', day: 'numeric' }
    let day = today.toLocaleDateString('en-us', options);

    res.render("list", { day: day, newItems: items });
});

app.post("/", (req, res) => {
    if ((x = req.body.newItem) !== "") {
        items.push(x);
    }
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});