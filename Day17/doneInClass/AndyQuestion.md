# Python Leaderboard
 
This is leaderboard using python, flask and SQAlchemy. This serves the purpose of:
1. How to set up an SQLite table using SQAlchemy
2. How to do the first half of CRUD.
	*Create (insert) data into the scores table with the Score class
	*Read existing data from the scores table and output that to the pages on the website
3. How to get the data to get inserted into the scores table via the POST method in our forms

Like most things, you have to think about what you want to accomplish in order to figure out how to do it. 

In this example, I decided I needed to store at least 2 pieces of data: 
1. Name of the player
2. Score of the player

I created a form for the player to fill out their name and then a means for JavaScript to fill in the value of the score field (which is a hidden field on the form) once the game was over. The player would use the form to submit their name and score, making the data available to be inserted into the scores table. The form is in the code from templates > game.html

Find below a line by line explanation of what is happening in each file:

## Main Python File: app.py 

We need to be able to connect our python file (app.py) to our database. Line 13 stores the path to the base directory, so we can have reference to the location of our new SQLite database on line 17. Line 13 and 17 work together to create a complete path. This way we don't have to type out the entire path and if your directory is different from mine, you do not have to update the code.

[Line 17](https://github.com/TrishZwei/python-leaderboard/blob/0c9aa2ba7d34e28f6db863afd8eb376c1236a145/app.py#L17) tells our app.py where to find the database.

[Line 18](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L18) tells us not to track modifications. This should be set to True or False. The default is none and will issue warnings about huge overhead if you do not set it to one of those values. False tells the db not to reply when a change has been made to the database. (upon insert, update, or delete)

[Line 21](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L21) stores the SQLAlchemy object in the variable 'db'. This way we can use the db variable to issue our CRUD commands to the database.


[Line 24](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L24-L26) we create class called Score. This class describes and defines all the ways we want to interact with the database.
Line 25 we specifically name the table what we want it to be named: scores
Line 26 creates a field with auto incremented identifiers for each row of data. 

An example row of data might look like:
```
2, 'Joe', 350

```
The first item is an id, which would be unique, so that if we want to update or delete that specific row of data, we have a way of pointing to only one row of data. Otherwise we'd be updating or deleting more than one row of data. See the image below:

![Table of Data](/assets/scoretable.png)

If I wanted to target one of Joe's scores for update or delete, I would have to target a row of data uniquely. If I wanted to delete row 2, where Joe has a score of 350, I can simply use the id. As seen below, the first one is easier to update or delete without potentially affecting the other rows of data.

```
delete where id = 2
 vs.
delete where p_name = 'Joe' AND p_score = 350
```
An update or delete on all the rows of data with p_name = 'Joe' would affect more than one row of data. So establishing a unique identifier is a good practice. 

[Lines 28 & 29](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L28-L29) create two other columns of data in our table: p_name and p_score. Notice that they are two different types of data. I purposefully want to store the score as an integer to make it more easily sortable.

[Line 32](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L32) is a function to have the class initialize itself. What properties does this instance have, and what their values are are added in lines 33 and 34.

[Line 36](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L36) is a function that creates a string representation of the object we just created whenever we call the Score class.

[Line 39](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L39) has been commented out so that it does not re-initialize tables in our db.

### def index(): 
[Line 41](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L41-L42) is the route for the index function.
Line 42 is the index function.

[Line 44](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L44) queries the db by calling the class Score and querying the table associated with the Score class. Here we are telling it to get the row data and order it by decending order the values in the p_score column, and give us the top 5 results. This is the READ part in CRUD

[Line 45](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L45) sets up an empty list for us.

[Line 47](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L47) creates a for each loop so we an append each item in the list of data from the database. This allows us to create a list of dictionaries which we send to the index.html page. It passes the list scores, which can then be displayed on the page with jinja. (see index.html)


### def game():
[Line 53](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L53-L54) is the route for this function and that route is how the function is called. 
Line 54 is the game function

[Line 56](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L56) is not triggered until the form has been submitted via the POST method. So the first time this page is loaded, it loads the JavaScript game. Once the game is complete the player will have the opportunity to add their data to the scores table.

Line 56 when data is submitted and the condition is true...
[Line 57](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L57) gets the value from the input where name="name"
If I enter my name: 
```
name="Trish"
```

[Line 58](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L58) gets the value from the input where name="score"
```
score="14950"
```
It is important to know that almost everything from a value in HTML is a string. Because I had set up the database column to store this value as an integer, I cast the string value into an integer.

[Lines 60 and 61](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L60-L61) are so that when I was testing/debugging I could see if the values were being captured from the form.

[Line 63](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L63-L65) is a variable which stores an instance of Score so I could create new values in the scores table through the Scores class. 
Line 64 creates the database command to add a new row of data to the scores table.
Line 65 tells the database to do Line 64

[Line 68](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L68) then redirects the player to scores.

### def scores():
[Line 72/73](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L72-L73) show the different ways we can access the scores function.
We can just go to the score page and we don't really get anything different than what is on the home page. This can be done from the main menu. But if we go to the scores page just *after* submitting a score, it allows you to filter out the scores by the name you just submitted.

[Line 76](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L76) queries the results just like the front page.
Line 77 is an empty list.

[Lines 79 - 81](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L79-L81) runs a foreach loop that puts our rows of data from the database into a dictionary which then gets inserted into the list so it does exactly what the front page does.

[Line 83](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L83) only gets triggered if the variable username has a value.
[Line 86](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L86) queries the database to filter its results by the username variable's value. Then it tells it to order those results by the p_score value descending and only the top 5 results.

[Line 87](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L87) creates another empty list for us (I see here an opportunity for refactoring)

[Lines 89 - 91](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L89-L91) does the same as [79 - 81](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L79-L81) only with a different query with different results from the database.

[Line 102 and 103](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/app.py#L102-L103) is the standard code to make this page run itself when called to do so.

## Other Files (Python):

### templates > layout.html
Layout contains the main html. Parts are broken up into chunks:
1. templates>includes>_head.html
 This page includes all the items that go  into the head tag of an html document.
2. templates>includes>_nav.html
	This page includes all the main navigation elements.
3. templates>includes>_foot.html
	This page ends the body tag and the html root. This ensures any JS goes above the closing body tag.


All the includes are only snippets and not complete pages, they have underscores in their names as part of their naming convention. 

The layout page and all pages that extend layout do not carry this convention since they are complete html documents

### templates > index.html
This is the home page. Shows the high scores, gives some instructions to the users. [Lines 18 - 23](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/templates/index.html#L18-L23) iterate out the rows of data.

### templates > game.html
This is the page where the pacman game is played and you can add your score to the database. The form is located on [line 14](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/templates/game.html#L14). The JavaScript that enables that modal/popup window to show the form is controlled on [line 301](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L301) of static > scripts > game.js 

[Line 304](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L304) of the game.js file inserts the value of the score into the hidden field of the form. This happens when the user clicks the button that gets them the modal window to appear.

### templates > scores.html
This is the list of high scores. This works just like the home page but with one added bonus. If a player comes to this page after adding their score to the leaderboard, it will query the database for that player's score. This is case sensitive. So "Trish" would be different from "trish". The determining factor is if the user navigates to the page with a username or not. If there is no username, the database does not get queried and the second tab/table does not appear. This can be seen in the two conditional statements on [lines 43](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/templates/scores.html#L43) and [65](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/templates/scores.html#L65) and [87](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/templates/scores.html#L87).

[Lines 87 - 101](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/templates/scores.html#L87-L101) govern if the local JavaScript appears on that page. No need for the tab JS if there is no tab. 

## Other Files (JS/CSS/favicons):
### static > css > styles.css
This is the main location of css styling. The code for the dynamic link to it is seen in templates > includes> _head.html

### static > favicons
This folder includes all the images for the wide array of favicons available. The code that connects the favicons are seen in templates > includes > _head.html 

This code and the images for the favicons were generated by [Real Favicon Generator](https://realfavicongenerator.net/). This provides a nice way to easily create favicons for your web projects. 

### static > scripts > game.js
This is the main code that drives our JavaScript game. It is added to the game.html template at the bottom. Our game.html file does not have a lot of code in it, primarily because the JavaScript is loaded externally. This is to keep the game file short since the focus of this project is python and flask. 

#### Explanation of JS code:
**Please note that this code should be put into an IIFE when deployed on a live server**
IIFE stands for Immediately Invoking Function Expression. This protects JavaScript Variables from being able to be accessed from the browser window. It is another layer of proection in a cross-site scripting attack. (XSS)

'use strict' makes sure that we declare our variables with keywords: var, let and const. This ensures we declare them in the appropriate scope and do not accidentally put them in the global scope.

[Lines 4 - 12](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L4-L12) are variables that many of our functions need to have access to the values. This is why it is in the larger scope. Additionally, these need to be put at the top because of the way the keyword let functions.

[Line 14 - 24](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L14-L24) is a for loop that sets up the grid for our game. This double for loop allows us to put unique identifiers on to each of the grid squares generated and makes sure that the columns and rows line up properly.

[Line 19](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L19) is our first use of the jQuery library. This code says:
create a variable 'square' that will be a div. That div will have the class of 'grid-square' and it will have an id attribute that looks something like: "0-0" the first value being the xCood value and the second being the yCoord value.
[Line 20](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L20) adds the square to the element with the id of "grid-container"

[Lines 26 and 27](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L26-L27) get the height and width of the elements with the class of "grid-square"

[Line 29](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L29) applies the width times the number of columns, and the height times the number of rows to determine what height and width the "grid-container" should be in order for the grid-squares to fit inside without collapse or overflow.

[Line 31](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L31) determines what square the pacman should be in and applies the pacman class to it.

[Line 34](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L34) is a list of all the elements that should receive the wall class.

[Line 36 - 39](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L36-L39) are the original coordinates for the ghosts. This helps when they re-spawn in their (or close to) original coordinates.

[Line 41 - 44](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L41-L44) assign the coordinates their appropriate classes.

[Line 47](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L47) is a list of all the squares that need to include a bean to be eaten for points.

[Line 49](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L49) is a list of the power ups and adds the class of power to that square.

[Line 53](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L52) is jQuery's shortcut method event listener for the keydown event. This tells the entire document to listen for when a key is on its way down to the keyboard, and to listen for which one. The e parameter in the function captures the event that occured and allows us to access its properties.

[Line 55](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L5) sees if the gameRunning value is set to true and if it is....
do all the stuff we want it to. Otherwise it gets ignored. This prevents the user from meeting the win condition on line 169, which is encased in this condition.

[Lines 57 and 58](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L57-L58) store temp values of the x-y coordinate of the pacman. This allows us to test the square to see if it is valid before putting our character into it.

[Line 61](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L61) checks for which key was pressed by getting the event object stored in e and checking its which property to see which key was pressed. 38 is up. We reset the y value to move upward in the grid. The comments below show other ways we can achieve the same thing in JS

[Line 60](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L60) responds to the down arrow
[Line 79](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L79) responds to the left arrow
[Line 84](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L84) responds to the right arrow

[Line 87](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L87) sets a variable called update to false. This will let us know if we can or cannot apply the temp values to move the character. We would rather the default be false. It ensures we apply true to that value when it should be true.

[Line 91 and 101](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L91-L101) checks to see if the player is crossing through the passthrough tunnel. It then resets the tempX values to have the player appear on the other side.

[Line 111](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L111) checks to see if the ghosts are still in the powerup phase where pacman can eat them. If (true) they are, lines 106-136 handles pacman getting points, and we handle the ghost to let him respawn in the inner box.

[Line 145](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L145) calls a function called genFloatGhost(pos.top, pos.left, color) that handles that animation and respawning. The arguments passed will change how the function operates. (see[Line 344](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L344) )

[Line 147](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L147) checks to see if pacman has run into a ghost. If true, calls the gameOver function. (see [Line 308](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L308))

[Line 153](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L153) checks to see if the square they are attempting to move into is a wall. If true... nothing happens.

[Line 156](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L156) is for any other conditions that have not been met. Any of these conditions are conditions in which the pacman can move normally. 

Line Inside here are other checks such as if the power up is in the next square. 

[Line 163](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L163) calls the getGhosts() function (see [Line 336](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L336) )

[Line 166](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L166) checks if there is a bean in the square

[Line 174](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L174) checks the win condition, if true, passes a 'win' argument which changes how the function operates (see [Line 308](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L308))

[Line 189](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L189) is triggered when the gameRunning value is something other than true.

[Line 191](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L191) checks to see if the escape key has been pressed

[Line 193](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L193) tells the element with the class of overlay to act as if it has been clicked. (see [Line 408](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L408))

[Line 199](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L199) ends the keydown listener

[Line 203](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L203) defines the moveGhost() function. This is a function to move our ghosts through the grid automatically. 

[Lines 204 and 205](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L204-L205) reserve the space for the value of the x - y coordinate of the ghosts as they get handled 1 by 1. Storing their values in this higher scope lets us set them for every ghost and check them individually.

[Line 207](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L207) is jQuery's each function, which works like a for each loop. It will handle each of the ghosts individually.

[Line 210](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L210) is assigning the 'this' keyword to the variable ghost and making it a jQuery object which will allow us to use jQuery methods on it.

[Line 214](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L214) gets the class list for the ghost square.

[Lines 217-220](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L217-L220) strip away the classes that are not related to the ghost and its functions. I need those classes to remain on this square when the ghost moves into the next square. If the class is on the square it will be stripped out from the class list and if the class is not on the square, JS won't care.

[Line 222](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L222) gets the value of the id of the square the ghost is currently in.

[Line 223](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L223) splits that id into an array which can then be accessed as an x coordinate and a y coordinate via bracket notation.

[Line 228](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L228) calls getRandomInt(1,4) to run. (see line: 330) This gives us a random value from 1-4.

[Line 230 and 231](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L230-L231) create temp values to be updated based on which number 1-4 was returned from getRandomInt.

[Lines 233-250](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L233-L250) determine which way the ghost wants to move. I plan to improve this set of code in the future to create an ai of sorts or possibly create paths for the ghosts to move on like the original pacman game does rather than depending upon pure randomization. Always think about how to improve your program.

[Line 250](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L250) checks to see if the ghost could move into the square it wants to. I added some comments to myself about how I could improve this functionality.

[Line 260](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L260) checks to see if a ghost is moving into a square with pacman. If true, gameOver() is called. (see [Line 308](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L308))


[Line 264](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L264) is run if none of the above conditions are met. 

[Line 266](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L266) checks to see if a ghost who is vulnerable to contact with pacman is moving into a square with pacman.

[Line 268](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L268) creates a variable color to be set upon the conditions immediately following.

[Lines 271-285](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L271-L285) checks which color the ghost has and sets the color variable to its color.

[Line 287](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L287) removes those classes from the current square, 

[Line 288](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L288) adds to the player score so they get points for eating the ghost.

[Line 290](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L290) gets the position of that square.

[Line 291](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L291) calls genFloatGhost(pos.top, pos.left, color) to run. 

[Line 293](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L293) is run when all the conditions above it are not met. And the code in lines 294 - 297 changes the square the ghost currently appears in.

[Line 303](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L303) calls the moveGhost function to run again, 200 milliseconds later.

[Line 305](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L305) is where the moveGhost function is closed.

[Line 308](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L308) is where the gameOver function is defined. There is one parameter called result and it is set to lose as a default. When 'win' is passed into it, it will respond with a different message.

[Line 309](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L309) sets gameRunning to false. This stops tells the program that the game is no longer running and prevents the use of the arrow keys from accidentally tripping a 'win' result.

[Line 311](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L311) clears the timer, so JS does not create an error when the game is over.
[Line 312](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L312) creates space for a message

[Lines 314-318](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L314-L318) set the value of message based off of the value of result.

[Line 320](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L320) empties the grid of its squares and inserts the html from message instead
[Line 322](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L322) adds to the grid-container an additional button.
[Line 323](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L323) adds a click event listener to that button. It is important to know that event listeners can only be applied to items on the DOM. This element was not on the DOM until now, but the modal window is. This event listener activates the modal window to appear AND inserts whatever the current value of the score is into the hidden field in the form in game.html

[Line 328](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L328) ends the gameOver function

[Line 330](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L330) defines getRandomInt(min = 1, max = 100)
By default the function returns a random number from 1 to 100. The min and max parameter have these values as defaults, but if the are passed a different set of values, the function still works to randomly generate a number from min to max.

I like to think of the keyword 'return' as a question asked and answered:
"Hey getRandomInt, give me a random number from 1 to 4."
The return value replies: "3" and that is the answer to my question above.

This function is a good helper function to have in your programs wherever you need numerical randomization.

[Line 334](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L334) calls the function moveGhost to run. (see [Line 203](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L203)). This line could be placed further down for better organization. Doesn't really matter as long as this call is in the proper scope. It just gets the ball rolling for the ghosts movement.

[Line 336](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L336) defines the funtion getGhosts. 
[Line 337-342](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L337-L342) finds all the squares with the class of 'ghost' and adds the class of 'ghosty' to it. It then starts a timer for 10 seconds, at the end of which removes the class ghosty from any squares that have that class added to them. The class of ghosty makes the ghosts vulnerable to attack from pacman.

[Line 344](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L344) defines the genFloatGhost(top = 1, left = 1, color = '') function. The parameter defaults are set, but will pick up the new values if passed. These are the top and left position of the square the ghosty was in when eaten by pacman, and the color of the ghost eaten.

[Line 345](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L345) creates a new div that will animate from where the ghost was eaten to its starting coordinates based on the color eaten. It creates a div inside the other floaty div and applies the inside class to that div. This creates the "floating" affect since it is outside of the grid. It appends itself to the body and not the grid container as seen on line 346.

[Line 346](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L346) appends the floating ghost to the body so it can move freely over the grid.

[Line 347](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L347) reserves space for the grid coordinates to be set so that the floaty ghost moves to those coordinates.

[Line 349-365](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L349-L365) is a switch statement that sets gCoords based on color's variable value.

[Line 367 and 368](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L367-L368) give us the top and left position of the square that has the id

[Line 370](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L370) adds an animation to our floaty that we created on line 345. jQuery's animate does not care where we start, but where we want to go and how long we want to take to get there. The parameters passed do that for us. The call back function (also on line 370) activates after the animation is complete. 

On [Line 374](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L374) it checks to see if we can put our current ghost into its start coordinates. If there is a ghost currently in that square, then lines 375 - 386 work to insert that ghost into an available space. And to do that only once. See commentary on [Line 380](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L380). A quick reminder the bang ( ! ) operator checks for the value to be the opposite. In this case it is looking for the false value.

[Line 382](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L382) makes sure the conditional on [Line 379](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L379) is only run once.

[Line 387](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L387) runs when the start space is available for ghost insertion.

[Lines 397-401](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L397-L401) are notes to myself for specific things I want to add to the program.

[Lines 404-406](https://github.com/TrishZwei/python-leaderboard/blob/51d1caf46675054f86064987aaa714f8e4045ae7/static/scripts/game.js#L404-L406) are to handle the modal window element that is hidden in the document.                

## Prerequisites

Your environment will need to have python available. In the app.py file from line 1 through line 7 shows all the imports and packages you need. If you use intellij, you should be able to import them into your environment. If you use the terminal window (mac) or the command line (win) you will need to know the commands to navigate and then install them into the development folder you are working in.

```
some knowledge of python and programming in general is 
important to understand this document and the programming 
behind it.
```

## Built With

* [Python](https://www.python.org/) - The main programming language used
* [Flask](https://flask.palletsprojects.com/en/1.1.x/) - The framework for rendering HTML pages
* [Jinja](https://jinja.palletsprojects.com/en/2.11.x/) - The ability to render variables on our HTML pages
* [SQLite](https://www.sqlite.org/index.html) - Our database
* [SQLAlchemy](https://www.sqlalchemy.org/) - Our database interface
* [jQuery](https://jquery.com/) - A JavaScript Library which allows for easier DOM Manipulation
* [Real Favicon](https://realfavicongenerator.net/) - a website where you can create favicons
