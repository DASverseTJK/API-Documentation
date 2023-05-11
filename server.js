const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require ('nodemailer');

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
 * email, password, confirm password
*/
const users = [
    {
        email : 'user1@gmail.com',
        password: 'pw1',
        confirmPassword: 'pw1'

    },
    {
        email : 'user2@gmail.com',
        password: 'pw2',
        confirmPassword: 'pw2'

    },
    {
        email : 'fail@gmail.com',
        password: 'pw1',
        confirmPassword: 'pw123'

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
    res.sendFile(__dirname + '/main.html');
});

app.get('/signup/auth', (req, res) => {
    if (typeof window !== 'undefined') {
        const sendBtn = document.getElementById("emailbtn");
        sendBtn.addEventListner("Verify", () => {
            sendVerification();
        });
    }
    res.sendFile(__dirname + '/createAccountAuth.html');
});


// Getting user's information from /test endpoint
app.get('/test', (req, res) => {
    res.json( {ok: true, users: users});
});

app.get('/test/email', (req,res) => {
    const emails = users.map(user => user.email);
    res.json({ok: true, emails: emails});
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

app.post('/signup', confirmPw, (req, res) =>{
    // res.sendFile(__dirname + '/main.html');
    // confirmPw will be processed to check validation of password and confirmPassword.
    // if password and confirmPassword is matched, rest of code will be processed ==> next() function from confirmPw
    const { email, password, confirmPassword} = req.body;

    // checking whether the email that user trying to signup is already exist or not
    const userExists = users.find(user => user.email === email);
    if( userExists ) {
        return res.status(409).json( {message : 'User already exist. Use different email'});
    }

    // Creating new user object to push new users
    const newUser = {
        email,
        password,
        confirmPassword
    };
    
    users.push(newUser);

    res.json( {ok: true, message : 'New User created successfully' });
});


function sendVerification() {
    const email = document.getElementById("emailbtn").value;
    if(!email) { 
        alert("Please enter an email address");
        return;
    }

    fetch("/signup/auth", {
        method: "POST",
        headers: {
            "Content-Type": "applicatoin/json",
        },
        body: JSON.stringify({ email }),
    })
        .then((response) => {
            if(response.ok) {
                throw new Error(response.status);
            }
            alert("Verification code sent!");
        })
        .catch((erorr) => {
            console.log(error);
            alert("Failed to send verification code");
        });

}


app.post('/signup/auth', confirmPw, sendVerification, (req, res) =>{
    res.sendFile(__dirname + '/createAccountAuth.html');
    // confirmPw will be processed to check validation of password and confirmPassword.
    // if password and confirmPassword is matched, rest of code will be processed ==> next() function from confirmPw
    const { email, password, confirmPassword} = req.body;


    // this is my own actual gamil account to test thie email transporter
    let transporter = nodemailer.createTransport({
        service: 'gamil',
        auth: {
            user: 'testAcc8150@gmail.com',
            password: 'testpw123!'
        }
    });

    const verificationToken = generateVerificationToken();
    users.verificationToken = verificationToken;

    const mailOptions = {
        from : 'testAcc8150@gmail.com',
        to: user.email,
        subject: 'Email Verficiation from G1-CASH',
        text : `Please click on the following link to verify your email address to sign up G1-Cash: `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) { console.log(error);                           }
        else      { console.log ('Email sent: ' + info.response); }
    });




    // checking whether the email that user trying to signup is already exist or not
    const userExists = users.find(user => user.email === email);
    if( userExists ) {
        return res.status(409).json( {message : 'User already exist. Use different email'});
    }

    // Creating new user object to push new users
    const newUser = {
        email,
        password,
        confirmPassword
    };
    
    // Add a qualified new user into server
    users.push(newUser);

    res.json( {ok: true, message : 'New User created successfully' });
});


app.listen(3000, () => console.log("G1 CASH Admin Homepage is OPEN"));