const init = (providers) => {
  // Facebook
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    providers.push({
      provider: 'facebook',
      Strategy: require('passport-facebook').Strategy,
      strategyOptions: {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET
      },
      scope: process.env.FACEBOOK_SCOPE ? process.env.FACEBOOK_SCOPE.split(',') : ['email', 'user_location'],
      getUserFromProfile: (profile) => ({
        id: profile.id,
        name: profile.displayName,
        email: profile._json.email
      })
    })
  }

  // TODO : Test this
  // Twitter
  if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
    providers.push({
      provider: 'twitter',
      Strategy: require('passport-twitter').Strategy,
      strategyOptions: {
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_SECRET
      },
      scope: null,
      getUserFromProfile: (profile) => ({
        id: profile.id,
        name: profile.displayName,
        email: profile.username + '@twitter'
      })
    })
  }

  // TODO : Test this
  // Google
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push({
      provider: 'google',
      Strategy: require('passport-google-oauth').OAuth2Strategy,
      strategyOptions: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      scope: 'profile email',
      getUserFromProfile: (profile) => ({
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      })
    })
  }

  // Github
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push({
      provider: 'github',
      Strategy: require('passport-github2').Strategy,
      strategyOptions: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      },
      scope: null,
      getUserFromProfile: (profile) => ({
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      })
    })
  }
}

module.exports = init