let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    heading: {
        type: String,
        required: true
    },
    
    url: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: false
    },

    image: {
        type: String,
        required: false
    },

    isSaved : {
        type: Boolean,
        default: false
    },

    savedBy : {
        type: String,
        required: false
    },

    savedDate : {
        type: Date,
        default: Date.now()
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
