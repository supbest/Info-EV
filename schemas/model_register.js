const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://localhost:27017/userdata")
    .then(() => {
        console.log('mongoose connected');
    })
    .catch((e) => {
        console.log('failed');
    });

const logInSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
logInSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

let LogInCollection = new mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;
module.exports.saveProduct = function (model, doc) {
    model.save(doc);
};
