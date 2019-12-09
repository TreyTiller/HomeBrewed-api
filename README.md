# To read more about the app head to the client repo! -https://github.com/TreyTiller/Homebrewed-app

## This application was built using the following:

       -React
       -HTML
       -CSS
       -JavaScript
       -JSX
       -Node
       -Express
       -Mocha/Chai/Enzyme
       -PostgreSQL
       
## API Endpoints:

### User Login
Returns a JWT for use as authentication throughout the application

* URL:
  /login
  
* Method:
  POST
  
* Url Params:
   None

* Data Params:
   None
   
### Recipe
Returns a JSON object with recipe meta information inside
( Title, Skill, Time, Coffee amount, Water amount )

* URL:
  /api/recipe/:user_id
  
* Method:
  GET
  
* Url Params:
   user_id travels with JWT after login as a param
   user_id: [integer]

* Data Params:
   When posting to this enpoint the recpie title, skill, and time are all required

### Recipe Directions
Returns a JSON object containing an array of directions

* URL:
  /api/directions/:recipe_id
  
* Method:
  GET
  POST
  
* Url Params:
Id set based on the active url param
   Recipe_id: [Integer]

* Data Params:
   The 'Title' is a required field which is to say all inputs must contain actual content

### Recipe Supplies
Returns a JSON object containing an array of supplies

* URL:
  /api/supplies/:recipe_id
  
* Method:
  GET
  POST
  
* Url Params:
 Id set based on the active url param
   Recipe_id: [Integer]

* Data Params:
   The 'Title' is a required field which is to say all inputs must contain actual content

### Registration
Creates user credentials to use for login

* URL:
  /api/users
  
* Method:
  POST
  
* Url Params:
   None

* Data Params:
   All inputs in form (nickname, username, password) are required

