module.exports = {
	db: 'root:abcd@ds139949.mlab.com:39949/junyeong', // remode mongodb
    facebook: {
    	clientID: '670670809797414',
    	clientSecret: '75a2d602dab852f03125468362906a22',
    	callbackURL: 'http://app.junyeongyu.com/facebook/callback',
    	callbackURLDev: 'http://localhost:3000/facebook/callback'
    },
    twitter: {
        consumerKey: 'GtosUNN1gkRqHIuln0yyKgpN0',
        consumerSecret: 'NkHSwO5ivL2vVVT4mIXix7nXGzJYcmGlFomukzl5F16eUpdexJ',
        callbackURL: "http://app.junyeongyu.com/twitter/callback"
    }
};
