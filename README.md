# news-comments
Stores user comments in MongoDB on current news articles.

## Links
[GitHub repo](https://github.com/philgraetz/news-comments)

[Deployed on Heroku](https://bc-news-comments.herokuapp.com)

## Technologies Used
- mongoDB
- mongoose
- express
- express-handlebars
- body-parser
- axios
- cheerio

## Instructions
This project is only partially working. What works (at Heroku):
- From the inial window, select "What to Display" -> "Current Articles"
- This will scrape the site "minnesota.cbslocal.com"
- Current news articles are displayed
- Login as philg/philg
- Select "What to Display" -> "Saved Articles"
- You will see a list of articles saved by "philg"
- Click "Add Comment" on one of the articles.
- An input field appears. Type a comment and "Submit"
- The comment is added to the DB, but not displayed (not working yet)

What's not working at this time:
- Does not display comments
- Does not delete articles
- Does not delete comments


## Screenshot
![Current Articles](/screenshots/CurrentArticles.PNG)

