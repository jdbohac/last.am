##  last.am

last.am is an app for archiving arcade games, scrobbling comments and logging playtime presented in an easy-to-use format. This app was developed using Node.js, MongoDB, Express and Bulma.
For now everything is logged to a single database with no user authentication but I would like to implement this at a later date. There are still some visual issues weith the show page (unwanted horizontal scrolling, header repoisitioning) that I am currently trying to iron out. 

## installation

After cloning your forked version of the github repo, navigate to the root directory ('/last.am')
in a terminal and run npm i to install the necessary dependancies for this project. After that you can run node Monitor from your terminal and navigate to localhost://3000 in your browser.
If there is no data present, remove the commenting from the '/seed' route and navigate to localhost://3000/seed to initialize and populate the database.
