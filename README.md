# task-manager Node.js Application
## About this application :
- with this application you can manage your tasks.

------------

## How to run this Application ?
- there are two ways to do that :

##### A. download and install application.
1. make sure you have installed mongodb on your system, [here](https://www.mongodb.com/docs/manual/administration/install-community/ "Here") is the installation link & make sure you have installed nodejs with npm, [here](https://nodejs.org/en/download/ "here") is the download link.
2. on terminal run the following command to download the application :<br>
`git clone https://github.com/m0x31h0x64i/task-manager`
3. then : <br>
`cd task-manager && npm i`
4. after that you need to set your own env variables. such as (PORT, MONGODB_URL, JWT_SECRET, SMTP, SMTP_PORT, USER, PASS). run following command to start createing dev env variables :<br>
`npm run env`<br>
5. if you **dont have SMTP** then just hit enter and ignore it plus you have to comment **lines 19 and 97 of users router**. then run application with :<br>
`npm run dev`
##### B. try demo to run the application. (https://key7789456.herokuapp.com)

------------


## How to use this Application ?
1. open postman and import **task-manager-postman.json**.
2. to be able to use postman with the new collection & if you want to use demo, just add **url** to postman env variables with value of `https://key7789456.herokuapp.com`  **&** if you want to use application localy then you need to set the value of postman **url** variable to `https://localhost:PORT`.

3. before making any request if heroku subdomains blocked in your country then you need to use VPN or PROXY to be able to make requests with postman.

------------

### Notes :
- libraries which i used to make this application :<br>
express, mongoose, validator, jsonwebtoken, bcryptjs, multer, sharp, nodemailer, prompt-sync, jest, supertest.
- i learned how i can work with new libraries.


------------

### v2.0.0 update notes :
- dev and test env creation added.
- test cases added.

