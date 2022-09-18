require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Todo = require("./models/Todo");
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
        console.log(err);
    });
console.log();
app.post("/newtodo", async (req, res) => {
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
app.get("/todoList", async (req, res) => {
    const todolist = await Todo.find({ username: req.body.username });
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
//   }

// ? this is how you make a new get request to this api to get todos of a user
//! Get
// ? http://localhost:5000/todolist
// * request.body:
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