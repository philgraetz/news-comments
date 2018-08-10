let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    by: {
        type: String,
        required: true
    },
    
    date: {
        type: Date,
        default: Date.now()
    },

    text: {
        type: String,
        required: true
    },

    articleId: {
        type: String,
        required: true
    }
});

let Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
