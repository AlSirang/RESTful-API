const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", ejs);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// new Model
const Article = mongoose.model("Article", require('./db'));

app.route("/articles")
    .get((req, res) => {
        Article.find((err, result) => {
            if (!err) {
                res.send(result).status(200);
            } else {
                res.send(err).status(500);

            }
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;

        const newArticle = new Article({
            title,
            content,
        });
        newArticle.save((err) => {
            if (!err) {
                res.send({
                    title,
                    content
                }).status(201);
            } else {
                console.log(err);
                res.sendStatus(500);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.sendStatus(200);
            } else {
                console.log(err);
                res.sendStatus(500);
            }
        })
    });

// to target specific article
app.route("/articles/:articleTitle")
    .get((req, res) => {
        const title = req.params.articleTitle;
        Article.findOne({ title, },
            (err, foundArticle) => {
                if (!err) {
                    if (foundArticle) {
                        res.send({ foundArticle }).status(200);
                    } else {
                        res.sendStatus(404);
                    }
                } else {
                    res.sendStatus(500);
                }
            });
    })
    .put((req, res) => {
        const article = req.params.articleTitle;
        const title = req.body.title;
        const content = req.body.content;

        Article.updateOne({ title: article },
            { title: title, content: content },
            (err) => {
                if (!err) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500)
                    console.log(err)
                }
            });

    })
    .patch((req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.updateOne({title: articleTitle},
            {$set: req.body}, (err)=>{
                if(!err){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(500);
                    console.log(err);
                }
            })
    })
    .delete((req, res) => {
        const articleTitle = req.params.articleTitle;

        Article.deleteOne(
            { title: articleTitle },
            (err) => {
                if (!err) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500)
                }
            }
        );


    });


mongoose.connect("mongodb://localhost:27017/wikiDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (!err) {
            console.log("Database connected Successfully.");
            app.listen(PORT, () => {
                console.log(`Server is listening at http://localhost:${PORT}`);
            });
        }
    });

