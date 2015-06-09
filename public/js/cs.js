'use strict';

var cs = (function() {
	function getGames(callback) {
		$.ajax({
			url: '../data/games.json',
			dataType: 'json',
			method: 'get',
			error: function(xhr, status, err) {
				callback(err, null);
			},
			success: function(games) {
				callback(null, games);
			}
		});
	}

	function getGame(id, callback) {
		$.ajax({
			url: '../data/games.json',
			dataType: 'json',
			method: 'get',
			error: function(xhr, status, err) {
				callback(err, null);
			},
			success: function(games) {
				var game = _.filter(games, function(game) {
					return game.id == id;
				});
				game = game[0];
				game.teams = _.map(game.teams, function(team) {
					team.players = _.sortBy(team.players, function(player) {
						return -player.score;
					});
					return team;
				});
				callback(null, game);
			}
		});
	}

	function renderArray(target, template, data) {
			var html = '';
			var compiled = _.template(template);
			_.forEach(data, function(row) {
				html += compiled(row);
			});
			$(target).html(html);
	}

	function render(target, template, data) {
		var compiled = _.template(template);
		var html = compiled(data);
		$(target).html(html);
	}

	function countPlayers(teams) {
		var players = [];
		_.forEach(teams, function(team) {
			players = players.concat(team.players);
		});
		players = _.uniq(players, function(player) {
			return player.id
		});
		return players.length;
	}

	function getRating(dividend, divisor) {
		if(dividend === 0) {
			return 0;
		}
		if(divisor === 0) {
			return 1;
		}
		return Math.round(dividend / divisor * 100) / 100;
	}

	function getPercentage(dividend, divisor) {
		return (getRating(dividend, divisor) * 100) + ' %';
	}

	function params() {
	    var qs = document.location.search;
	    var params = {},
	        tokens,
	        re = /[?&]?([^=]+)=([^&]*)/g;
	    while (tokens = re.exec(qs)) {
	        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	    }
	    return params;
	}

	return {
		getGames: getGames,
		getGame: getGame,
		render: render,
		renderArray: renderArray,
		countPlayers: countPlayers,
		getRating: getRating,
		getPercentage: getPercentage,
		params: params
	}
})()