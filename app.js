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

moment.locale('fr');

//user controlers

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())


app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs',
  array
}))

app.set('view engine', '.hbs')

app.use(express.static('public'));
app.use('/api', api)

// app.get('/', (req, res) => {
//   res.render('login')
// })

app.get('/', (req, res) => {

  if (req.query.error == '1') {
    res.render('login', {
      message: 'Invalid login / password',
      title: 'my other page',
      layout: 'entry'
    })
  } else {
    res.render('home', {
      identity: identity,
      layout: 'entry'
    })
  }
})

app.get('/login', (req, res) => {

  if (req.query.error == '1') {
    res.render('login', {
      message: 'Invalid login / password',
      title: 'my other page',
      layout: 'entry'
    })
  } else {
    res.render('login', {
      identity: identity,
      layout: 'entry'
    })
  }
})

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

//notifications system (copie de pvault)
app.get('/pnotif', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  if (!identity) {
    res.render('login', {
      message: 'Invalid token, please log in',
      layout: 'entry'
    })
  } else {

    // the token from the query arguments
    var token = req.query.token;

    var args = {
      headers: {
        "token": token
      } // request headers
    };
    // get the data in rest from the server
    client.get("http://localhost:3000/api/mails", args, function(data, response) {
      console.log(data)
      data.forEach((arr) => {
        arr.forEach((msg) => {
          Object.assign(msg, {
            messageCreationDate: moment(msg.messageCreationDate).local().fromNow(),
          })
        })
      })
      // for the Web interface
      res.render('pnotif', {
        mails: data,
        identity: identity,
        token: token,
        layout: 'member'
      })
    });

  }
})

app.get('/feed', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
  if (!identity) {
    res.render('login', {
      message: 'Invalid token, please log in',
      layout: 'entry'
    })
  } else {
    res.render((profile === 'administrator') ? 'feedadmin' : 'feed', {
      identity: identity,
      token: token,
      profile: profile,
      layout: (profile === 'administrator') ? 'admin' : 'member'
    })
  }
})

// Personal Vault
app.get('/policies', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  let userUid = identity.userUid;

  if (!identity) {
    res.render('login', {
      message: 'Invalid token, please log in',
      layout: 'entry'
    })
  } else {

    let data;
    var args = {
      headers: {
        "token": token
      } // request headers
    };
    // get the data in rest from the server
    client.get("http://localhost:3000/api/insured/" + userUid, args, function(policies, response) {

      policies.policies.forEach((policy) => {
        Object.assign(policy, {
          policyDateOfEffect: moment(policy.policyDateOfEffect).local().format('Do MMMM YYYY'),
        })
      })
      res.render('policies', {
        policies: policies,
        identity: identity,
        token: token,
        layout: 'member'
      })
    });
  }
})

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
      res.render('addusers', {
        identity: identity,
        token: token,
        layout: 'admin',
        users: users
      })
    }
  })
})

app.get('/back', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
  var profile = services.profile(token);
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

  client.get("http://localhost:3000/api/mailsback", args, function(data, response) {
    data.forEach((msg) => {
      Object.assign(msg, {
        messageCreationDate: moment(msg.messageCreationDate).local().fromNow(),
      })
    })
    var token = req.query.token;
    args = {
      headers: {
        "token": token
      } // request headers
    };
    // get the data in rest from the server
    client.get("http://localhost:3000/api/user", args, function(clients, response) {
      res.render('back', {
        identity: identity,
        messages: data,
        clients: clients,
        token: token,
        layout: 'exportlayout'
      })
    });
  })
}
});

app.get('/newmsg', (req, res) => {
  var token = req.query.token;
  var identity = services.sessionToken(token);
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
    res.render('sendmessage', {
      identity: identity,
      token: token,
      clients: clients,
      userUid: userUid,
      layout: 'member'
    })
  });
  }
})

app.get(/.*/, function(req, res){
  res.end("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Error</title></head><body><h1>www.vinaro.me</h1><h2>Error 404 : </h2><p>The requested URL " + req.url + " was not found on this server.</p><br><p><button onclick='window.history.back()' style='padding: 10px; border: 1px solid #ccc; cursor: pointer;'> &lt; Page precedente</button> </p></body></html>")
});

module.exports = app