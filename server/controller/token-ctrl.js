const jwt = require('jwt-simple');
const secret = process.env.SECRET || 'xyz';
const csrf = require('csurf');

const csrfProtection = csrf({cookie: true});
const mongo = require('../db/conn');

class TokenCtrl {
    static ensureTokenInCookie(req, res, next) {
        try {
            if(req.cookies && req.cookies['calorie-token']) {
                req.user = { ...jwt.decode(req.cookies['calorie-token'], secret) };
            }
        }catch(err) {
            return res.status(403).send('Unauthorized');
        }
        
        if(req.user && req.user.email) {
            mongo.getDb()
              .collection("users")
              .findOne({email: req.user.email})
              .then(function(result){
                  if(result) {
                      req.user.role = result.role;
                      req.user.dailyLimit = result.dailyLimit;
                      return next();
                  }
                  else {
                      return res.clearCookie("calorie-token").redirect('/login');
                  }
              });
        } else {
            return res.redirect('/login');
        }
    }
    static ensureToken(req, res, next) {
        try {
            if(req.cookies && req.cookies['calorie-token']) {
                req.user = { ...jwt.decode(req.cookies['calorie-token'], secret) };
            } else if(req.headers && req.headers['authorization']) {
                let token = req.headers['authorization'].split(/\s+/).pop() || '';
                req.user = { ...jwt.decode(token, secret) };
            }
        }catch(err) {
            return res.status(403).send('Unauthorized');
        }
        
        if(req.user && req.user.email) {
            mongo.getDb()
              .collection("users")
              .findOne({email: req.user.email})
              .then(function(result){
                  if(result) {
                      req.user.role = result.role;
                      req.user.dailyLimit = result.dailyLimit;
                      return next();
                  }
                  else {
                      return res.status(403).send('Unauthorized');
                  }
              });
        } else {
            return res.status(403).send('Unauthorized');
        }
    }

    static ensureCSRF(req, res, next) {
        if(process.env.NODE_ENV!== 'production') {
            return next();
        }

        return csrfProtection(req,res,next);
    }
}

module.exports = TokenCtrl;