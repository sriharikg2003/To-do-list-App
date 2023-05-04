const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require("mongoose");

// To do list Database
// todolist database connection
mongoose.connect('mongodb://127.0.0.1:27017/todolist');



// ****************************************************************

// todolist schema
const todolist = mongoose.Schema({
  name: String,

})

// todolist model
const Item = mongoose.model('Item', todolist, 'Items');

// todolist records 
const item1 = new Item({
  name: "Eat"
})

const item2 = new Item({
  name: "Code"
})

const item3 = new Item({
  name: "Sleep"
})

const DefaultArray = [item1, item2, item3];
darry = ["Eat", "Code", "Sleep"]
// ****************************************************************

// Route list Schema
const routeSchema = new mongoose.Schema({
  name: String,
  List: [todolist],
})

// Route list model
const routeListModel = mongoose.model('routeList', routeSchema, 'routeList');

// Route list record

// function route() {
//   const routeRecord = new routeListModel({
//     name: string_recieved,
//     list: [todolist]
//   })
// }

routeList = [];



// One time initialization
Item.find().then(it => {
  if (it.length == 0) {
    Item.insertMany(DefaultArray).then(() => { console.log('One time initialisation Item inserted successfully') })
  }
});

const workItems = [];

app.get("/", function (req, res) {
  dumm = [];
  Item.find().then(it => {
    for (i in it) {
      dumm.push(it[i].name);
    };
    res.render("list", { listTitle: "Today", newListItems: dumm });
  });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  res.redirect("/");
  const itemn = new Item({
    name: item
  })
  itemn.save().then(() => { console.log('to do list inserted into collections successfully') });
});


app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/delete", function (req, res) {

  checkID = req.body.checkID;

  console.log(req.body)

  if (req.body.koli == "Today") {
    Item.deleteOne({ name: req.body.check }).then(() => {
    });
    res.redirect("/");
    console.log("*****************************");
  }

  else {

    console.log("delete");
    
    routeListModel.findOneAndUpdate({name :req.body.koli  },{$pull : {List :{name : req.body.checkID}}}).then(()=> {console.log();})


    res.redirect("/"+req.body.koli );


    
  //   routeListModel.findByIdAndUpdate({ name: req.body.koli }, { $pull: { List: { name: checkID } } }).then(() => {res.redirect("/" + req.body.koli);});

    
  }
})




app.get("/:route", function (req, res) {
  const directory = req.params.route;

  routeListModel.findOne({ name: directory }).then(it => {

    if (!it) {
      res.render("list", { listTitle: directory, newListItems: darry });


      const routeRecord = new routeListModel({
        name: directory,
        List: DefaultArray
      })

      routeRecord.save();



    }

    else {

      ItemList = it.List;

      passArray = [];
      for (i in ItemList) {
        passArray.push(ItemList[i].name);
      }
      res.render("list", { listTitle: directory, newListItems: passArray });
    }

  }
  );


})



app.post("/:route", function (req, res) {

  const directory = req.params.route;

  var list = [];
  routeListModel.findOne({ name: directory }).then(it => {

    it.List.push(Item({
      name: req.body.newItem,
    }));

    it.save();
    res.redirect("/" + directory);

  });

});


app.listen(8080, function () {
  console.log("Server started on port 8080");
});