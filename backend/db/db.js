const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://umarkhaji456:umaryas123@cluster0.mv6byn5.mongodb.net/paytm')
    .then(() => {
        console.log('Connected to database Sucuessfully');

    })
    .catch((error) => {
        console.log('there is a problem in database' + error);
    })

const UserSchema = new mongoose.Schema({
    'username': String,
    'firstName': String,
    'lastName': String,
    'password': String
});

const AccountSchema = new mongoose.Schema({
    'userId': {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    'amount': Number
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
    User,
    Account
}