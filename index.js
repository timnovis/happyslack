var Botkit = require('botkit');
var request = require('request');

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: 'YOUR_BOT_TOKEN',
}).startRTM();

controller.on('direct_mention', function(bot,message) {
	console.log(message);
	request.post('https://language.googleapis.com/v1beta1/documents:analyzeSentiment',
	    {
	    	json: {
				"document": {
					"type": "PLAIN_TEXT",
					"content": message.text
				},
				"encodingType": "UTF8"
	    	},
	    	headers: {
	    		"Authorization" : "Bearer <YOUR_GOOGLE_TOKEN>"
	    	}
	    },
	    function (error, response, body) {
			var resp = body.documentSentiment.polarity;
			if(resp >= 0) {
				var emoji = ' :grinning:';
			} else if(resp < 0) {
				var emoji = ' :disappointed:';
			}
			bot.reply(message, "Your happiness scale is " + resp.toString() + emoji);
	    }
	);
});