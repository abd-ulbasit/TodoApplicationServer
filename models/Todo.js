const { model, Schema } = require("mongoose");
const TodoSchema = new Schema({
    username: String,
    title: String,
    description: String,
    isStarred: Boolean,
    isArchived: Boolean,
    updatedOn: Date,
});
module.exports = model("Todo", TodoSchema);
