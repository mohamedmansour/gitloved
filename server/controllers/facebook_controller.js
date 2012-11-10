// Main GitHub Controller.
var rest = require('restler')

var app = null;
var db = null;

exports.attach = function(_app) {
  app = _app;
  db = app.get('db');
}

exports.index = function(req, res) {
  console.log('FACEBOOK:INDEX');
  res.render('layout');
}

exports.new = function(req, res) {
  console.log('FACEBOOK:NEW');
  var url = [
    'https://www.facebook.com/dialog/oauth',
    '?client_id=' + app.get('facebook-app-id'),
    '&redirect_uri=' + app.get('redirect-uri') + 'facebook/edit',
    '&scope=email,user_birthday'
  ]
  res.redirect(url.join(''));
}

exports.edit = function(req, res) {
  console.log('FACEBOOK:EDIT');
  var url = 'https://graph.facebook.com/oauth/access_token';
  var data =  {
    'client_id': app.get('facebook-app-id'),
    'redirect_uri': app.get('redirect-uri') + 'facebook/edit',
    'code': req.query['code'],
    'client_secret': app.get('facebook-app-secret')
  };
  rest.post(url, { data: data }).on('complete', function(data, response) {
    if (response.statusCode == 200) {
      var accessToken = data.split('&')[0]
      var url = 'https://graph.facebook.com/me?' + accessToken;
      rest.get(url).on('complete', function(data, response) {
        if (response.statusCode == 200) {
          data = JSON.parse(data);
          var user = db.User.findOne({'facebook.id': data.id}, function(err, user) {
            if (user) {
              user.facebook = data;
              user.email = data.email;
              user.username = data.username;
              user.name = data.name;
              user.save(function() {
                req.session.user_id = user._id;
                console.log('user_id', req.session.user_id);
                res.redirect('/');
              });
            } else {
              user = new db.User({
                facebook: data,
                email: data.email,
                username: data.username,
                name: data.name
              });
              user.save(function() {
                req.session.user_id = user._id;
                console.log('user_id', req.session.user_id);
                res.redirect('/');
              });
            }
          });
        } else {
          // TODO: return error
        }
      });
    }
  });
}