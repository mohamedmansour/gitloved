GL.Views.UserStatus = GL.Framework.View.extend({
  el: '#profileUserStatus',

  initialize: function(options) {
    console.log('profileUserStatus', options);
    _.bindAll(this);
    this._template = GL.Framework.template('UserStatus');
    this.render();
    GL.Events.on(GL.Constants.INSTAGRAM_DATA_RECEIVED_EVENT, this.updateInstagram);
    GL.Events.on(GL.Constants.FACEBOOK_DATA_RECEIVED_EVENT, this.updateFacebook);
  },
  
  render: function() {
    var status = { creative: 25, social: 25, geek: 25 };
    
    if (this.model.github) {
      var github = this.model.github
      status.creative = status.creative + github.public_repos * .3;

      status.geek = ((2 * github.public_repos) + github.public_gists) * .6;      
      
      if (github.blog) {
        status.social = status.social + github.blog.length * 0.1;
      }
      if (github.bio) {
        status.social = status.social + github.bio.length * 0.03;
      }
      if (github.location) {
        status.social = status.social + 3;
      }
      status.social = status.social + (github.following * 0.03) + (github.followers * 0.06);
      
    }
    
    if (this.model.instagram) {
      var instagram = this.model.instagram
      status.social = status.social + instagram.bio.length * 0.2;
      status.social = status.social + instagram.website.length * 0.1;
    }
    
    if (this.model.facebook) {
      var facebook = this.model.facebook
      
      if (facebook.sports) {
        status.social = status.social + facebook.sports.length * 0.3;
      }
    }
    
    if (this.instagram) {
      status.creative = status.creative + this.instagram.length * 0.3;
    }
    
    if (this.facebook) {
      status.social = status.social + this.facebook.length * 0.1;
    }
    
    status = {
      social: Math.floor(status.social * 100) / 100,
      creative: Math.floor(status.creative * 100) / 100,
      geek: Math.floor(status.geek * 100) / 100,
    }
    console.log('status', status);
    this.$el.html(this._template(status));
  },
  
  updateInstagram: function(json) {
    console.log('updateInstagram', json)
    this.instagram = json;
    this.render();
  },
  
  updateFacebook: function(json) {
    console.log('updateFacebook', json)
    this.facebook = json;
    this.render();
  }

});