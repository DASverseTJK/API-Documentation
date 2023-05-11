/**
 * Copyright (c) 2023 Cedars
 * File: server.js
 * Author          : Tae Jin Kim
 * Language        : Javascript
 * Framework       : Node.js
 * API Development : postman
 * IDE             : Visual Studio Code
 * DB              : MySQL using workbench
 * Date: 2023-05-08 ~ 2023-05-11 [Status : On going]
 * Description: - Purpose of this program is using express and Postman to write API document.
 *              - This program is built to get data from user registration, send verification code via gmail, and create new user account after filtering all conditions
 *                  - filter : 
 *                      - email : has to be unique
 *                      - password + confirmpassword : has to be matched
 *                      - Authentication code : send code via gmail after inputing email to verify
 *                          - verify the account using authentication token provide to users
 *              - allows user to log in after registration
 * History : 
 *          2023-05-08:
 *                      - Set up Postman  
 *                          - [GET] Email Request
 *                          - [Post] Signup Request    
 *                          - [Post] send Auth Email        
 *                      - set up basic of express module (get + post)
 *                      - set up basic of Sequence Chart
 *                      - Created front-end part to test out in webpage : NEED TO BE TOUCHED AFTER DONE WITH BACKEND
 *          2023-05-09:
 *                      - finished sequence chart
 *                      - Done with
 *                          - get 
 *                              - /test/email
 *                              - /test
 *                              - /
 *                          - post 
 *                              - /signup
 *                          - confirm password + passwrod matching
 *                          - sending email
 *                      - needs to be touched
 *                          - generate random verification token
 *                          - [GET] Auth Request
 *                      - needs to be done
 *                          - wrtie document
 *          2023-05-10:
 *                      - Postman:
 *                          - [GET] UserInfo
 *                          - [POST] send Auth Email
 *                          - [DELETE] Fail Auth then Delete Temp Account
 *                          - [POST] verifyEmail
 *                          - [POST] Signup Request 
 *                      - server.js:
 *                          - /test/email
 *                          - /signup/verify
 *                          - /signup
 *                          - /signup/auth
 *                          - /delete/temp
 *                      - needs to be done: 
 *                          - wait for 3 min
 *                          - only delete if auth fail
 *                          - so on
 *          2023-05-11:
 *                      - Postman:
 *                          Done with API Document
 *                      - server.js:
 *                          - /test/login
 *                              - Checks whether user input email exists or not
 *                              - Checks password
 *                              - If all credentials are correct, log in.
 *                                  - No need to check other credential because to create password, everything has to be passed.
 */

const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require ('nodemailer');
const crypto = require('crypto');


/**
 * https://kirkim.github.io/javascript/2021/10/16/body_parser.html
 * To read body data from http request from client : body-parse middle ware
 * express.json()
 *  ==> reading JSON format data
 * express.urlencoded()
 * == > setting up middleware
 *      extended: fase ==> Using querystring moudle in Node.js
 *       - output : [Object: null prototype] { sample: 'hello world' }
 *      extended: true ==> Using qs module that requires to download
 *       - output : { sample: 'hello world' }
 * If express.json() cannot read data, use Postman: POST request as JSON format.
 * */ 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static('public'));

/** 
 * Dummy data for G1 cash
 * email, password, confirm password, verificationToken
 *  - Email : cannot be duplicated
*/
const users = [
    {
        email : 'user1@gmail.com',
        password: 'pw1',
        confirmPassword: 'pw1',
        verificationToken : "",
        verify : ""
    },
    {
        email : 'user2@gmail.com',
        password: 'pw2',
        confirmPassword: 'pw2',
        verificationToken : "",
        verify : ""
    },
    {
        email : 'fail@gmail.com',
        password: 'pw1',
        confirmPassword: 'pw123',
        verificationToken : "",
        verify : ""
    },
    {
        email : 'tjmax09300@gmail.com',
        password: 'pw123',
        confirmPassword: 'pw123',
        verificationToken : "23456789",
        verify : ""
    }
]



/**
 * req        : email  , string, madatory(y), desc(User Email)
 * res (JSON) : 
 *              result , string, (Y/N)      , desc(Result)
 *              message, string,            , desc(Success or Reason for failure)
 *              code   , int   ,            , desc(Error Code)
 * url         : /test
 * method      : GET
 * API ID      : 1001
 * @Description : Test
 * @path {GET} http://localhost:3000/test
 * 
 */
app.get('/', (req, res) => {
    //const users = getUsers();
    //res.send(users);
    res.send("Hello, welcome to G1 CASH Admin Homepage");
});

app.get('/signup', (req, res) => {
    // res.sendFile(__dirname + '/main.html');
});

app.get('/signup/auth', (req, res) => {
    // res.sendFile(__dirname + '/createAccountAuth.html');
    const token = users.map(user => user.verificationToken);
    const verify = req.body; 
    res.json( {ok: true, tokens : token});
});


// Getting user's information from /test endpoint
app.get('/test', (req, res) => {
    const { email, password, confirmPassword, verificationToken, verify } = req.body;
    const userInfo = users.map(user => user);
    res.json( {ok: true, userInfo: userInfo});
});

app.get('/test/email', (req,res) => {
    // list of emails
    const emails = users.map(user => user.email);

    // selecting specific emails from body in postman
    const theEmail = req.body.email;
    let theUser = users.find(user => user.email === theEmail);

    // if found the user has the email that looking for
    if (!users.find(user => user.email === theEmail)) {
        // if body from postman does not have input, print list of emails
        if(req.body.email == null) {
            res.json({ok: true, emails: emails});
        } else {
            // if input does not match with saved email, print error
            res.status(404).json({
                ok : false, 
                message: "Could not find email that you are looking for"
            });
        }
    } 
    // if program found matched email, print
    else if (users.find(user => user.email === theEmail)) {
        res.json({ok : true, 
            email: theUser.email
        });
    }
});

function confirmPw(req, res, next) {
    // Grab password and confirmPassword from body
    const { password, confirmPassword} = req.body;

    // if they do not match, return 400 error.
    if( password != confirmPassword) {
        return res.status(400).json( {message : 'Password and Confirm Password do not match. Check your password'});
    }
    // if matched, move on to next part, which will continue in app.post
    next();
}


/**
 * /signup/verify 
 * This POST request receives email and verify code to match provided token with user input token and give verificationToken value same as provided token
 */
app.post('/signup/verify', (req,res) => {
    const verToken = req.body.verify;
    const verEmail = req.body.email;
    // console.log(verEmail + " input email");
    // console.log(verToken + " input token");

    // making sure user input email and token to verify
    if( verEmail === "" || verToken === "" ) {
        return res.status(400).json( {message : 'Fill out empty space'});
    }
    // serach for the user input email to verify
    const myEmail = users.find(user => user.email === verEmail);
    // If email is found, set token into the temporary email, else null.
    const myToken = myEmail ? myEmail.verificationToken : null;
    
    // token missing error
    if(myToken == null) {
        res.status(404).json({message: 'Token is missing'});
    }
    // console.log(myEmail.email + " my email");
    // console.log(myToken + " my token");

    // If there is temporary email, verify token, and token is matched to be proven, verification is done.
    if(myEmail && (myEmail.verify != null) && (verToken === myToken)) {
        myEmail.verify = myToken;
        console.log(users.verify + " users verify");
        res.json({
            ok: true, 
            message: "verified", 
            verificationToken: verToken, 
            verify: myEmail.verify
        });
    // else error
    } else {
        return res.status(400).json( {message: 'Verification Token Invalid. Try again'});
    }
});


/**
 * /signup
 * Receives email, password, confirmPassword, and verificationToken to create a user (Registration)
 * If one of user input (email, password, confirmPassword) is missing, returns error
 * If email exists (created and saved when verification token is provided: meaning if token is provided), insert user input and create new account 
 */
app.post('/signup', confirmPw, (req, res) =>{
    // res.sendFile(__dirname + '/main.html');
    // confirmPw will be processed to check validation of password and confirmPassword.
    // if password and confirmPassword is matched, rest of code will be processed ==> next() function from confirmPw

    const { email, password, confirmPassword } = req.body;

    // checking whether the email that user trying to signup is already exist or not : aka. verification token is provided and verified
    const userExists = users.find(user => user.email === email);

    // if any of those information is missing, send error
    if( email == null || password == null || confirmPassword == null ) {
        return res.status(400).json( {message : 'Fill out empty space'});
    }
    
    // Only if verification token is provided and proved by user, let user register new account
    else if( userExists && (userExists.verificationToken === userExists.verify)) {
        userExists.password = password;
        userExists.confirmPassword = confirmPassword;
        res.json({
            ok: true, 
            user : userExists, 
            message : 'New User created successfully' 
        });
    }
    // If user try to register before verification, send error
    else {
        res.status(400).json( {message: "Invalid Approach: Check verification, if not please contact"});
    }
});

// Generate random encrypted 16 letter length token for verification
function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * /singup/auth
 * Receives a email from user and generate token via email so that user can verify email to register
 */
app.post('/signup/auth', (req, res) =>{
    //res.sendFile(__dirname + '/createAccountAuth.html');
    // confirmPw will be processed to check validation of password and confirmPassword.
    // if password and confirmPassword is matched, rest of code will be processed ==> next() function from confirmPw
    const { email } = req.body;
    // generate random token and save to send
    const verificationToken = generateToken();

    // this is my own actual gamil account to test thie email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // own gmail account to send email.
          user: 'testAcc8150@gmail.com',
          pass: 'vkzncvuameukbrdi'
        }
      });


    // users.verify = verificationToken;

    // checking whether the email that user trying to signup is already exist or not
    const userExists = users.find(user => user.email === email);
    // if user input email is being used, error
    if( userExists ) {
        return res.status(409).json( {message : 'User already exist. Use different email'});
    }

    // if any of those information is missing, send error
    else if( email == "" || verificationToken == "" ) {
        return res.status(400).json( {message : 'Fill out empty space'});
    }
    // if email is not being used and verificationToken is succeefully created, send email and create temporary account to store the token
    else {
        // Creating new user object to push new users
        const newUser = {
            email : `${email}`,
            password: null,
            confirmPassword: null,
            verificationToken : `${verificationToken}`,
            verify: ""
        };
        users.push(newUser);
        const mailOptions = {
            from : 'testAcc8150@gmail.com',
            to: email,
            subject: 'Email Verficiation from G1-CASH',
            text : `Please click on the following link to verify your email address to sign up G1-Cash: '\n' ${verificationToken}`
        };
    
        // transporter that sends mail.
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) { console.log(error);                           }
            else      { console.log ('Email sent: ' + info.response); }
        });

    }
    // SENT
    res.json( {
        ok: true, 
        message : 'Verification token sent' , 
        verificationToken : verificationToken, 
        email : email
    });
});

app.delete('/delete/temp', (req, res) =>{
    const { email } = req.body;
    const findUser = users.findIndex(user => user.email === email);
    
    if(findUser !== -1) {
        users.splice(findUser, 1);
        return res.json({message: "Authentication Time out"});
    }
    else {
        return res.status(404).json({ message : "User not Found"});
    }

});

app.get('/test/login', (req,res) => {
    const { email, password } = req.body;
    const loginUser = users.find(user => user.email === email);

    if(loginUser && loginUser.password === password) {
        return res.json({
            ok : true, 
            message : `Successfully logged in with :  ${email}`
        });
    }
    else {
        return res.status(404).json({ message: "Email and Password Invalid"});
    }
    
});



// http://localhost:3000
app.listen(3000, () => console.log("G1 CASH Admin Homepage is OPEN"));