##  last.am

last.am is an app for archiving arcade games, scrobbling comments and logging playtime presented in an easy-to-use format. 
This app was developed using Node.js, MongoDB, Express and Bulma. 
It took many hours of watching videos and reading documnetation for me to fully unsderestand the Bulma columns system
but I believe I managed to make it work for my needs. The design of the page is responsive and should look decent
on just about any device. Pagination was done with JS logic. It could definitely be a bit more robust and should maybe be done using queries but noentheless it functions as intended.

    For now everything is logged to a single database with no user authentication but I would like to implement this at a later date.
    I wouldn't feel comfortable adding this feature without the full ability to encrypt user information so as
    to not be responsible for user information being compromised.  
    
    Another feature I would like to implement is a database search feature so users wouldn't have to scroll through entries to find the one they are looking for.
    
    For now the app is presented as an open platform where any visitor can edit the full database, rewrite entries, create and delete comments.
    

[visit the live site here!](https://last-am.herokuapp.com/)

## installation

After cloning your forked version of the github repo, navigate to the root directory ('/last.am')
in a terminal and run npm i to install the necessary dependancies for this project. After that you can run node Monitor from your terminal and navigate to localhost://3000 in your browser.
If there is no data present, remove the commenting from the '/seed' route and navigate to localhost://3000/seed to initialize and populate the database.
