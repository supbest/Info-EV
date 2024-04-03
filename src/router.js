const express = require('express')
const router = express.Router()
const path = require('path')
const LogInCollection = require('../schemas/model_register')
const multer = require('multer')
const cookie = require('cookie-parser')
const pointCollection = require('../schemas/model_point')
const commentCollection = require('../schemas/model_comment')
const bcrypt= require('bcrypt')
const image = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./')
    }
})

router.get('/', (req, res) => {
    res.render('login')
})
router.get('/api/points', async (req, res) => {
    try {
        // Fetch all data from pointCollection
        const points = await pointCollection.find({});
        res.status(200).json(points);
    } catch (error) {
        console.error("Error fetching points:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/api/points/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const point = await pointCollection.findById(id);
        if (!point) {
            return res.status(404).json({ error: 'Point not found' });
        }
        res.json(point);
    } catch (error) {
        console.error("Error fetching point:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/home', (req, res) => {
     res.render('home')
 })

router.post('/api/signup', async (req, res) => {
    let a = new LogInCollection({
         email: req.body.email,
         name: req.body.name,
         password: req.body.password
     })
     console.log(a)
     await a.save();



     const checking = await LogInCollection.findOne({ name: req.body.name })

    try{
     if (checking.name === req.body.name && checking.password===req.body.password) {
         res.send("user details already exists")
     }
     else{
         await LogInCollection.insertMany([doc])
     }
    }
    catch{
     res.send("wrong inputs")
    }

    res.status(201).render("home", {
         naming: req.body.name
     })
});


router.post('/api/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await LogInCollection.findOne({ name });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }
        req.session.username = user._id;
        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error('Login failed:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/api/newcharger', async (req, res) => {
    try {
        const {
            pointName,
            latitude,
            longitude,
            type,
            spec,
            description,
            link
        } = req.body;

        const newCharger = new pointCollection({
            pointName,
            latitude,
            longitude,
            type,
            spec,
            description,
            link
        });

        console.log(newCharger);

        await newCharger.save();

        res.status(201).json({ message: 'New charger added successfully' });
    } catch (error) {
        console.error('Error adding new charger:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/api/comment', async (req, res) => {
    try {
        const timestamp = new Date().toLocaleDateString('en-GB'); // Get current timestamp in "dd/mm/yyyy" format
        let com = new commentCollection({
            comment: req.body.comment,
            MarkerId: req.body.MarkerId,
            username:req.body.username,
            timestamp: timestamp // Add timestamp to the comment
        });
        console.log(com);
        await com.save();
        res.status(200).send("Comment saved successfully");
    } catch (error) {
        console.error("Error saving comment:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/api/comments', async (req, res) => {
    try {
        const markerId = req.query.markerId;
        let comments;

        if (markerId) {
            comments = await commentCollection.find({ MarkerId: markerId });
            // Transform comments to include only timestamp and comment text
            comments = comments.map(comment => ({
                comment: comment.comment,
                timestamp: comment.timestamp,
                username:comment.username // Include timestamp in the response
            }));
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete('/api/logout', (req, res) => {
    try {
        if (req.session.username) {
            // Clear the session
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                // Respond with success message
                return res.status(200).json({ message: 'Logout successful' });
            });
        } else {
            // User is not logged in
            return res.status(401).json({ message: 'You are not logged in' });
        }
    } catch (error) {
        console.error('Logout failed:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/api/username', async (req, res) => {
    try {
        const user = await LogInCollection.findById(req.session.username);
        if (!user) {
            return res.status(404).json({ error: 'Please Log In' });
        }
        // Send the username to the frontend

        console.log(user.name)
        res.status(200).json({ username: user.name });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/api/checkLoggedIn', (req, res) => {
    if (req.session.username) {
        // User is logged in
        res.status(200).json({ isLoggedIn: true });
    } else {
        // User is not logged in
        res.status(200).json({ isLoggedIn: false });
    }
});


router.get('/api/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await commentCollection.find({ MarkerId: id });
        comments = comments.map(comment => ({
            comment: comment.comment,
            timestamp: comment.timestamp // Include timestamp in the response
        }));

        // If no comments found for the given markerId
        if (!comments) {
            return res.status(404).json({ error: 'No comments found for the specified marker ID' });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/api/ID')
    console.log(pointCollection._id)
module.exports = router