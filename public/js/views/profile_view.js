GL.Views.Profile = GL.Framework.View.extend({

  initialize: function () {
    this._template = GL.Framework.template('Profile');
    this.model =  new GL.Models.User({id: 'me'});
    this.model.on('change', this.renderProfile, this);
    this.model.fetch();
  },

  render: function() {
    $(this.el).html('Loading ..');
    return this;
  },

  renderProfile: function() {
    var jsonModel = this.model.toJSON();
    $(this.el).html(this._template(jsonModel));
    this.userCardView = new GL.Views.UserCard({model: jsonModel});
    this.userStatusView = new GL.Views.UserStatus({model: jsonModel});


    var idModel = { id: jsonModel.id };
    if (jsonModel.facebook) {
      this.facebookView = new GL.Views.Facebook({model: idModel});
    }

    if (jsonModel.github) {
      this.githubView = new GL.Views.Github({model: idModel, userModel: jsonModel.github });
    }

    if (jsonModel.instagram) {
      this.instagramView = new GL.Views.Instagram({model: idModel});
    }
    return this;
  }
});

