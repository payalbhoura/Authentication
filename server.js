const express = require('express')
const server = express();
// const session = require('express-session')
const session = require('express-session')
const path = require('path')
const db = require("./models/db");
const User = require('./models/user');
const port = 3000;

server.use(express.json())
server.use(express.urlencoded())
server.use(session({     //middleware
    secret: 'payalsecret',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:10000}
}))

server.get("/", (req, res) => {
    res.sendFile(path.resolve("views/homepage.html"));
})

server.get("/dashboard", (req, res) => {
    if (!req.session.isLoggedIn) {
        res.redirect("/login")
        return
    }
    res.sendFile(path.resolve("views/dashboard.html"))

})

server.get("/login", (req, res) => {
    res.sendFile(path.resolve("views/LOGINPAGE.html"))
})


server.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password //server pe store
    User.findOne({//db se verify kiya//promise return
        email: email
    }).then((result) => {
        console.log(result);
        if (result == null) {
            res.status(404).end()
            return
        }
        if (password != result.password) {
            res.status(409).end();
            return
        }
        req.session.email = result.email//session mai mail ko store krna
        req.session.isLoggedIn = true
        res.redirect("/dashboard");
    }).catch(err => {
        console.log(err);
    })

})


server.get("/signup", (req, res) => {
    res.sendFile(path.resolve("views/signup.html"));
})

server.post("/signup", (req, res) => {//database
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password//server pr store
    //mongoes main stata store krna hai

    User.create({//mpdel.create is a fucntion//create a used to create a entry in db
        name: name,
        email: email,
        password: password
    })//promise deta haio
        .then((result) => {
            console.log('result==>', result);
            if (result) {
                res.redirect("/login")
                return
            }
            res.status(304).end();

        }).catch((err) => {
            if (err.code == 11000) {
                res.status(409).end()
                return
            }
            console.log("errr==>", err)
            res.redirect("/error")
        });

})


server.get("*", (req, res) => {
    res.sendFile(path.resolve("views/errorpage.html"))
})


db.init() //call//promise return
    .then(() => {
        server.listen(port, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`successfully statred server at port ${port}`);
        })

    }).catch((err) => {
        console.log(err)
    }
    )