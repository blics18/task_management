# TM (Task Management Project)
A version of a to do list where there will be boards and in each board there will be categories and a list of tasks users can add under a category.

# How to get started
1. Clone the master branch onto your computer
2. In the terminal, change directory into project directory 
3. In the project directory, run:
```
npm install
```
4. Download Postgres https://www.postgresql.org/download/macosx/ (for Mac)
5. Open another terminal and type 
```
psql -U postgres
```
and when prompted for password enter 
```
password
```
```
Note: if error is "psql command not found" must export the path 
Note: if password is incorrect, enter password for superuser that you entered
```
6. Create 2 databases (development, test) used for this project by running the commands:
```
CREATE DATABASE "taskManagement";
```
```
CREATE DATABASE "test";
```
7. Create the superuser's username and password to by running the command:
```
CREATE USER "postgres" WITH PASSWORD 'password';
```
```
ALTER USER "postgres" WITH SUPERUSER;
```
8. Back in the projects directory, run these commands to run migrations:
```
node_modules/.bin/sequelize db:migrate
```
9. Launch the website by running this command:
```
npm start
``` 
10. In your web browser, navigate to http://localhost:3000 to see the login page
11. To begin Mocha testing, run:
```
npm run test:migration
```
```
npm test
```
After the test is finished run the command to undo migrations
```
npm run test:undo-migration
```
12. To begin TestCafe testing, run: 
```
npm run test:migration
```
```
npm run test:server
```
then open a new terminal and run:
```
npm run test:testcafe
```

# Features
### Auth/Login Page
It allows a user to sign up for a new account if they do not have one. It checks to see if an email is unique to prevent duplicate emails. If a user already has an account, they can login with their email and password. There will be a check to see if the email and password is correct. There will also be a session when a user is logged in. 

### Home Page
Once the user signs up or logs in, they will presented the home page. On the home page there will be board titles. However, a new user will have no boards. Users can create a new board by clicking on the “Create New Board” button which will bring up a modal which users can fill out the board title form. Users can also edit the title of the board and delete a board, which will delete categories and list of tasks under that board. There will also be a navigation bar at the top that will have a home button and a logout button. 

### Board Page
When a user clicks on a board title, they will be presented a page of columns of categories with lists of tasks underneath a category. A new board will have no categories and therefore no tasks. Users can add new categories by clicking “Add Category” which will bring up a modal with a form which users have to fill out. Under a category, users can add new tasks and delete tasks. Users can also delete categories, which will delete all tasks under a category as well. Users can also trag tasks into other categories as well. There will be a navigation bar at the top which includes a home button, the name of the board the user is currently in, and a logout button. 

# Technologies

### Front-End
* HTML/CSS
* Javascript/jQuery
* Bootstrap
* EJS Templating

### Back-End
* Node.js
* Express
* PostgreSQL
* Sequelize

### Packages
* Client Sessions

### Testing
* Mocha
* Chai
* TestCafe
