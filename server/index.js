'use strict';

const http = require('http');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const pino = require('pino')({
  useLevelLabels: true
});
const cookieParser = require('cookie-parser');

/**
 * Import local env
 */

 if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(__dirname,'./.env')
  });
}

async function start() {
  
  /**
   * Setup Express
   */

  const app = express();

  app.set('views', path.join(__dirname, '../simple-calorie-app/dist/simple-calorie-app'));
  app.engine('html', ejs.renderFile);
  app.set('trust proxy', 1);

  /**
   * Setup Static Router
   */

  app.use(require('./router/static-router'));


  /**
   * Parser
   */

  app.use(cookieParser());

  /**
   * Setup Express Middleware
   */

  app.use(require('./router/router'));

  /**
   * Setup Token Router
   */

  app.use(require('./router/token-router'));    
  
  /**
   * Helmet
   */

  const helmet = require('helmet');

  app.use(helmet.xssFilter({ setOnOldIE: true }));
  app.use(helmet.frameguard({ action: 'sameorigin' }));
  app.use(helmet.hsts({
    maxAge: 7776000000,
    includeSubDomains: true,
    preload: true
  }));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
  app.use(helmet.dnsPrefetchControl({ allow: false }));

  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\''],
      styleSrc: ['\'self\''],
      imgSrc: ['\'self\''],
      connectSrc: ['\'self\''],
      fontSrc: ['\'self\''],
      objectSrc: ['\'self\'']
    },

    // Set to true if you only want browsers to report errors, not block them
    reportOnly: false,

    // report violations
    reportUri: '/report-violation',

    // Set to true if you want to blindly set all headers: Content-Security-Policy,
    // X-WebKit-CSP, and X-Content-Security-Policy.
    setAllHeaders: false,

    // Set to true if you want to disable CSP on Android where it can be buggy.
    disableAndroid: false,

    // Set to false if you want to completely disable any user-agent sniffing.
    // This may make the headers less compatible but it will be much faster.
    // This defaults to `true`.
    browserSniff: true
  }));

  const noCache = require("nocache");
  app.use(noCache());

  /**
   * SyntaxError in body-parser json error handler
   */

   app.use(function (err, req, res, next) {

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      pino.error(err);
      return res.status(400).json("Bad JSON");
    }

  });

  /**
   * CSRF Error Handler
   */

  // error handler
  app.use(function (err, req, res, next) {

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      pino.error(err);
      return res.status(400).json("Bad JSON");
    }
    
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403).json({message: 'invalid csrf token'});
  });

  /**
   * Setup Last Resort Error Handler
   */

  app.use((err, req, res, next) => {
    pino.error(err);
    res.status(500).json('Something broke!');
  });

  /**
   * Start Server
   */

  const port = process.env.PORT || 3000;
  const server = http.createServer(app);
  return server.listen(port);
}


let db;
db = require('./db/conn');

db.connectToServer(function(err) {

  if(err) {
    pino.error(err);
    process.exit();
  }

  start()
  .then(listener => {
    pino.info(`Server started at ${listener.address().port}`);
  })
  .catch(err => {
    pino.error(err)
  });

});


process.on('unhandledRejection', err => {
  pino.error(err);
});