let request = require('request');
var axios = require("axios");
let cheerio = require('cheerio');
let mongoose = require("mongoose");

let db = require("../models");

const SCRAPE_URL = "https://minnesota.cbslocal.com/";

const helpers = require("../views/hbs-helpers");

// === Connect to mongodb =======================================
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news_db";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// === routes ==================================================
module.exports = function(app) {
    // static route
    app.use(express.static('public'));

    // Home - same as '/index'
    app.get("/", function(req, res) {
        res.redirect("/index");
    });

    //
    // Display the main page
    //
    app.get("/index", function(req, res) {
        res.render("index", {});
    });

    //
    // Scrape
    //
    app.get("/new-articles/:login", function(req, res) {
        console.log("/new-articles");
        let loggedInAs = req.params.login;
        let isSaved = false;
        let savedBy = "";
        let savedDate = 0;
        let comments = [];

        console.log("Scraping URL " + SCRAPE_URL);

        // request(SCRAPE_URL, function(error, response, html) {
        axios.get(SCRAPE_URL)
        .then(function(response) {
            console.log("returned from URL " + SCRAPE_URL);
            // console.log(response.data);
            // if (error) {
            //     console.log(error);
            //     return res.send(error);
            // }
            let articles = [];
            let $ = cheerio.load(response.data);
            $(".cbs-thumbnail-link").each(function(i, elt) {
                let url     = $(elt).attr("href");
                let wrapper = url ? $(elt).children(".title-wrapper") : null;
                let heading = wrapper ? $(wrapper).children(".title").text() : null;
                let summary = wrapper ? $(wrapper).children(".description").text() : null;
                let image = $(elt).children(".thumbnail-wrapper").find("img").attr("data-src");

                // We're only interested in the headings with description (summary)
                // and those with url that start with "https"
                if (url && summary && url.startsWith("https")) {
                    // Add to the array (if not already in the array)
                    addOnce(articles, {heading, summary, url, image, isSaved, savedBy, savedDate, comments});
                }

            });
            // Now that we have a list of new articles,
            // check against DB to see if they already exist.
            // We'll need to do some fancy recursion here because
            // the DB call is asynchronous...
            // When this is done, it will do the render.
            renderData ={
                pageHeading : "Current Articles",
                loggedInAs: loggedInAs,
            };
            checkDBForArticles(articles, 0, res, renderData);
        })
        .catch(function(error) {
            console.log(error);
        });
    });

    //
    // Saved Articles
    //
    app.get("/saved-articles/:login", function(req, res) {
        console.log("/saved-articles");
        let loggedInAs = req.params.login;

        db.Article.find({})
        .then(function(dbArticles) {
            renderData ={
                pageHeading : "Saved Articles",
                loggedInAs: loggedInAs,
            };
            let hbsObject = { 
                articles : dbArticles,
                data     : renderData,
                helpers  : helpers
            };
            res.render("index", hbsObject);
            return;
        })
        .catch(function(err) {
            console.log(err);
            return;
        });
    });

    //
    // Login
    //
    app.post("/api/login", function(req, res) {
        console.log(req.body);
        db.User.find({login: req.body.login})
        .then(function(dbUser) {
            if (dbUser.length > 0 && dbUser[0].login === req.body.login) {
                console.log("User " + req.body.login + " already in db");
                return res.json(dbUser);
            } else {
                db.User.create(req.body)
                .then(function(dbUser) {
                    // View the added result in the console
                    console.log(dbUser);
                    return res.json(dbUser);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
            }
            return res.json(dbUser);
        });
    });

    //
    // Save an Article
    //
    app.post("/api/save-article", function(req, res) {
        let article = req.body;
        article.isSaved = true;
        console.log(article);

        db.Article.create(article)
        .then(function(dbArticle) {
            return res.json(dbArticle);
        })
        .catch(function(err) {
            return res.json(err);
        });
    });

    //
    // Add a comment
    //
    app.post("/api/add-comment", function(req, res) {
        console.log("/api/add-comment");
        console.log(req.body);
        db.Comment.create(req.body)
        .then(function(dbComment) {
            return res.json(dbComment);
        })
        .catch(function(err) {
            return res.json(err);
        });
    });

};

// =============================================================

// Add to the array only if it's not already in the array
// Also check the DB. Use the DB version if there is one.
function addOnce(array, newObj) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].heading === newObj.heading) {
            // console.log("Found duplicate heading: " + newObj.heading);
            return;
        }
    }
    array.push(newObj);
}

function checkDBForArticles(articles, index, res, renderData) {
    // If we're done, render the data
    if (index === articles.length) {
            let hbsObject = { 
            articles : articles,
            data     : renderData,
            helpers  : helpers
        };
        res.render("index", hbsObject);
        return;
    }

    // Otherwise, check the next item in the list.
    db.Article.find({heading: articles[index].heading})
    .then(function(dbArticle) {
        // If we found this article in DB, replace it with DB object
        if (dbArticle.length > 0) {
            // console.log("Found DB article [" + dbArticle[0] + "] [" + dbArticle[0].heading + "]");
            articles.splice(index, 1, dbArticle[0]);
        }
        // Recurse again until we've gone through the list of articles
        checkDBForArticles(articles, index+1, res, renderData); 
    })
    .catch(function(err) {
        console.log(err);
        return;
    });
}


