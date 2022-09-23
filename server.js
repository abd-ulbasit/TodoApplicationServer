require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
const Todo = require("./models/Todo");
const User = require("./models/User");
app.use(express.json());
mongoose
    .connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err.message);
    });
console.log();
app.post("/newtodo", async (req, res) => {
    // console.log(req.body);
    const newTodo = new Todo(req.body);
    try {
        await newTodo.save();
        res.status(201).json({
            status: "success",
            data: newTodo,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error,
        });
    }
});
app.get("/todolist", async (req, res) => {
    const todolist = await Todo.find({
        username: req.query.username,
        isArchived: false,
    });
    try {
        res.status(200).json({
            status: "success",
            data: todolist,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error,
        });
    }
});
app.get("/archivedtodos", async (req, res) => {
    const todolist = await Todo.find({
        username: req.query.username,
        isArchived: true,
    });
    try {
        res.status(200).json({
            status: "success",
            data: todolist,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error,
        });
    }
});

app.patch("/updatetodo", async (req, res) => {
    try {
        console.log(req.body.id);
        console.log(req.body.fieldToUpdate);
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.body.id,
            req.body.fieldToUpdate,
            {
                new: true,
                runValidators: true,
            }
        );
        console.log(updatedTodo);
        res.status(201).json({
            status: "success",
            data: updatedTodo,
        });
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: error,
        });
    }
});
app.delete("/deletetodo", async (req, res) => {
    console.log(req.body.id);
    try {
        await Todo.findByIdAndDelete(req.body.id);
        console.log("after deleting");
        res.status(204).json({
            status: "success",
            message: "deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
        });
    }
});

app.post("/newuser", async (req, res) => {
    const userInDB = await User.find({ username: req.body.username });
    console.log(userInDB);
    if (userInDB.length > 0) {
        res.status(200).send(
            JSON.stringify({ message: "User Already Exists" })
        );
        return;
    }
    const newUser = new User(req.body);
    console.log(newUser);
    try {
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post("/users", async (req, res) => {
    console.log(req.body.username);
    try {
        const user = await User.findOne({
            $and: [
                { username: req.body.username },
                { password: req.body.password },
            ],
        });
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(200).send({
                message: "User Not Found",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { username: 1 })
            .sort({ _id: -1 })
            .limit(15);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get("/finduser", async (req, res) => {
    try {
        const user = await User.find(
            {
                username: { $regex: req.query.search, $options: "i" },
            },
            { username: 1 }
        );
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(200).send({
                message: "User Not Found",
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening on port: ${port}`));

// ? this is how // ? this is how you make a new Update request to this api
// ! patch
// ? http://localhost:5000/updatetodo
// * request.body:
// {
//     "id":"6326ca40dac7bbba11656958",
//     "fieldToUpdate":
//     {
//      "title":"This is update title",
//      "description":"updated description"
//     }
//   }

// ? http://localhost:5000/newtodo
// * request.body:
// {
//     "username":"basit",
//     "title": "String",
//     "description": "String",
//     "isStarred": true,
//     "isArchived": false,
//     "updatedOn": "2022-09-18T07:27:37.192Z"
//      "completed":false
//   }

// ? this is how you make a new get request to this api to get todos of a user
//! Get
// ? http://localhost:5000/todolist
// * request.body:
// in axios params
// {
//     "username":"basit",
//   }

// ? this is how you make a new Update request to this api
// ! patch
// ? http://localhost:5000/updatetodo
// * request.body:
// {
//     "id":"6326ca40dac7bbba11656958",
//     "fieldToUpdate":
//     {
//      "title":"This is update title",
//      "description":"updated description"
//     }
//   }
// ? this is how you make a delete request to this api
// ! delete
// ? http://localhost:5000/deletetodo
// * request.body:
// {
//     "id":"6326ca40dac7bbba11656958",
//   }
