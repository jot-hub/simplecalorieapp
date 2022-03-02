const path = require('path');

class IndexCtrl {
  static serve (req, res) {
    res.render(path.join(__dirname, '../../simple-calorie-app/dist/simple-calorie-app/index.html'), {
      ... (process.env.NODE_ENV == 'production') && { csrf_token: req.csrfToken() },
      user: {
        email: req.user.email,
        role: req.user.role,
        dailyLimit: req.user.dailyLimit
      }
    })
  }
}

module.exports = IndexCtrl