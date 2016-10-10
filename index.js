var botkit	= require('botkit'),
	gcloud 	= require('google-cloud');

var language = gcloud.language({
	projectId: 'YOUR_GOOGLE_PROJECT_ID',
	keyFilename: 'service-key.json',
});

var controller = botkit.slackbot({
  debug: false
});

controller.spawn({
  token: 'YOUR_SLACK_TOKEN',
}).startRTM();

controller.on(['direct_mention', 'direct_message'], function(bot, message) {

	language.detectSentiment(message.text, function(error, sentiment, response) {
		var polarity = response.documentSentiment.polarity.toString();
		var magnitude = response.documentSentiment.magnitude.toString();
		if(polarity >= 0) {
			var emoji = ' :grinning:';
		} else if(polarity < 0) {
			var emoji = ' :disappointed:';
		}
		bot.reply(message, "You are about " + polarity + " units of happy. " + emoji + " Your sentence has a magnitude of " + magnitude);
	});

});