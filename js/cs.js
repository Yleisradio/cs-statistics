'use strict';

var apiUrl = '//ebot-api.c3t.yle.fi/';

var cs = (function() {
	function getGames(callback) {
		$.ajax({
			url: apiUrl + 'api/matches',
			dataType: 'json',
			method: 'get',
			crossDomain: true,
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
			url: apiUrl + 'api/match/' + id,
			dataType: 'json',
			method: 'get',
			crossDomain: true,
			error: function(xhr, status, err) {
				callback(err, null);
			},
			success: function(game) {
				game = sanitizeGame(game);
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
		return (Math.round(getRating(dividend, divisor) * 100)) + ' %';
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

	function sanitizeGame(game) {
		game.teams = [{}, {}];
		game.players = _.map(game.players, function(player) {
			if(player.pseudo.indexOf('natu') > -1) {
				player.pseudo = 'natu';
			}
			return player;
		});
		var playersByTeam = _.groupBy(game.players, 'team');
		playersByTeam[0] = _.sortBy(playersByTeam.a, function(player) {
			return -player.nb_kill;
		});
		playersByTeam[1] = _.sortBy(playersByTeam.b, function(player) {
			return -player.nb_kill;
		});
		game.teams[0] = {
			name: game.team_a_name,
			players: playersByTeam[0],
			side: 't',
			score: game.score_a
		};
		game.teams[1] = {
			name: game.team_b_name,
			players: playersByTeam[1],
			side: 'ct',
			score: game.score_b
		};
		return game;
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