'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const services = require('./services');
const helpers = require('handlebars-helpers');
const array = helpers.array();

const moment = require('moment');
const path = require('path');
const fs = require('fs');
var identity;

const Client = require('node-rest-client').Client;
const client = new Client();
const app = express();
const api = require('./routes');

moment.locale('en-gb');

//user controlers

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

// Handlebars

app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs',
  array
}))

app.set('view engine', '.hbs');
app.use(express.static('public'));
app.use('/api', api)

// root

app.get('/', (req, res) => {
  if (req.query.error == '1') {
    res.render('login', {
      message: 'Invalid login / password',
      title: 'my other page',
      layout: 'entry'
    })
  } else {
    res.render('home', {
      layout: 'entry'
    })
  }
})


// register

app.get('/register', (req, res) => {
    res.render('register', {
      layout: 'entry'
    })
})

// login

app.get('/login', (req, res) => {

  if (req.query.error == '1') {
    res.render('login', {
      message: 'Invalid login / password',
      title: 'my other page',
      layout: 'entry'
    })
  } else {
    res.render('login', {
      layout: 'entry'
    })
  }
})

// admin : Add addministrator

app.get('/userspanel', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  var args = {
    headers: {
      "token": token
    } // request headers
  };
  client.get("http://localhost:3000/api/user", args, function(users, response) {
    console.log(users)
    if (!identity && profile !== 'administrator') {
      res.render('login', {
        message: 'Invalid token, please log in',
        layout: 'entry'
      })
    } else {
      res.render('addadmin', {
        identity: identity,
        token: token,
        layout: 'admin',
        users: users
      })
    }
  })
})

// Messages

app.get('/mailbox', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  if (!identity) {
    res.render('login', {
      message: 'Invalid token, please log in',
      layout: 'entry'
    })
  } else {

    var token = req.query.token;

    var args = {
      headers: {
        "token": token
      } 
    };
   
    client.get("http://localhost:3000/api/mails", args, function(data, response) {
      console.log(data)
      data.forEach((arr) => {
        arr.forEach((msg) => {
          Object.assign(msg, {
            messageCreationDate: moment(msg.messageCreationDate).local().format('DD/MM/YYYY - HH:mm'),
          })
        })
      })
      // for the Web interface
      res.render('pnotif', {
        mails: data,
        identity: identity,
        token: token,
        profile: profile,
        layout: (profile === 'administrator') ? 'admin' : 'member'
      })
    });

  }
})

// display posts

app.get('/feed', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  var args = {
    headers: {
      "token": token
    } // request headers
  };
  client.get("http://localhost:3000/api/posts", args, function(posts, response) {
    console.log(posts)
    posts.forEach((post) => {
      Object.assign(post, {
        postCreationDate: moment(post.postCreationDate).local().format('Do MMMM YYYY HH:mm')
      });
    });

    if (!identity && profile !== 'administrator') {
      res.render('login', {
        message: 'Invalid token, please log in',
        layout: 'entry'
      })
    } else {
      res.render('feed', {
        identity: identity,
        token: token,
        layout: (profile === 'administrator') ? 'admin' : 'member',
        posts: posts
      })
    }
  })
})

// display members

app.get('/members', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  var args = {
    headers: {
      "token": token
    } // request headers
  };
  client.get("http://localhost:3000/api/user", args, function(users, response) {
    console.log(users)
    users.users.forEach((user) => {
      Object.assign(user, {
        signupDate: moment(user.signupDate).local().format('Do MMMM YYYY')
      });
    });

    if (!identity && profile !== 'administrator') {
      res.render('login', {
        message: 'Invalid token, please log in',
        layout: 'entry'
      })
    } else {
      res.render('members', {
        identity: identity,
        token: token,
        layout: (profile === 'administrator') ? 'admin' : 'member',
        users: users
      })
    }
  })
})

// mailbox create new message

app.get('/newmsg', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  let userUid = identity.userUid;
  var args = {
    headers: {
      "token": token
    } // request headers
  };
  if (!identity) {
    res.render('login', {
      message: 'Invalid token, please log in',
      layout: 'entry'
    })
  } else {
    client.get("http://localhost:3000/api/user", args, function(clients, response) {
    res.render('newmessage', {
      identity: identity,
      token: token,
      clients: clients,
      userUid: userUid,
      layout: (profile === 'administrator') ? 'admin' : 'member'
    })
  });
  }
})

// Create a post

app.get('/post', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  let userUid = identity.userUid;
  var args = {
    headers: {
      "token": token
    } // request headers
  };
  if (!identity) {
    res.render('login', {
      message: 'Invalid token, please log in',
      layout: 'entry'
    })
  } else {
    client.get("http://localhost:3000/api/user", args, function(clients, response) {
    res.render('post', {
      identity: identity,
      token: token,
      clients: clients,
      userUid: userUid,
      layout: (profile === 'administrator') ? 'admin' : 'member'
    })
  });
  }
})

app.get(/.*/, function(req, res){
  res.end("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Error</title></head><body><h1>www.vinaro.me</h1><h2>Error 404 : </h2><p>The requested URL " + req.url + " was not found on this server.</p><br><p><button onclick='window.history.back()' style='padding: 10px; border: 1px solid #ccc; cursor: pointer;'> &lt; Page precedente</button> </p></body></html>")
});

module.exports = app