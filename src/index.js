const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("../schemas/model_register")
const port = process.env.PORT || 3001
const router = require('./router')
const cookie = require('cookie-parser')
const cookieParser = require("cookie-parser")
const session = require('express-session')
const cors = require('cors');
app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
global.loggedIn = null
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requseted-With, Conten-Type, Accept');
    next();
})
const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath); 

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))
app.use(session({secret:"mysession",resave:false,saveUninitialized:false}))
const checkLoggedIn = (req, res, next) => {
    if (req.session.username) {
        // User is logged in
        next();
    } else {
        // User is not logged in
        res.status(401).json({ message: "Unauthorized" });
    }
};
app.use(router)
app.use(checkLoggedIn);

app.listen(port, () => {
    console.log('port connected');
})