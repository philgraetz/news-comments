let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    login: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

let User = mongoose.model("User", UserSchema);

module.exports = User;
