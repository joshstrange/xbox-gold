let config = require('./config');
let rp = require('request-promise');
let cheerio = require('cheerio');
let moment = require('moment');
let push = require( 'pushover-notifications' );

console.log("Running at: "+moment().format('YYYY/MM/DD HH:mm:ss'));

let options = {
	uri: 'http://www.xbox.com/en-US/live/games-with-gold',
	transform: function (body) {
		return cheerio.load(body);
	}
};

let p = new push( {
	user: config.pushover.user,
	token: config.pushover.token,
	onerror: function(error) {
		console.log('There was a problem connecting to Pushover:');
		console.log(error);
	}

});


rp(options).then(function($) {
	let games = [];
	$('.game.white-c').each(function() {
		let el = $(this);
		let dateString = el.find('.availDate').text();
		let dates = dateString.split(' - ');
		games.push({
			name: el.find('h3').text(),
			url: el.find('.dl-cta').attr('href'),
			startDate: moment(dates[0] + '/' + moment().year(), 'MM/DD/YYYY'),
			endDate: moment(dates[1] + '/' + moment().year(), 'MM/DD/YYYY')
		});
	});

	console.log('Found ' + games.length + ' games');

	games.forEach(function(game) {
		let now = moment();
		let inFirstTwoDays = now.isAfter(game.startDate) && now.isBefore(game.startDate.clone().add(config.alert.daysAfterAvailable, 'days'));
		let inLastTwoDays = now.isAfter(game.endDate.clone().subtract(config.alert.daysBeforeUnavailable, 'days')) && now.isBefore(game.endDate);

		if(game.url && (inFirstTwoDays || inLastTwoDays)) {
			console.log('Sending notification for: ' + game.name);
			p.send({
				message: game.name,   // required
				title: "New Xbox Gold Game Available",
				sound: 'magic',
				url: game.url
			}, function( err, result ) {
				if ( err ) {
					throw err;
				}
				console.log( result );
			});
		} else {
			console.log(game.name + ' did not meet the requirements for notification');
		}
	});
});