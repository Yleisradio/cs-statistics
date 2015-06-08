'use strict';

var strict = (function() {
	$.ajax({
		url: '../data/games.json',
		dataType: 'json',
		method: 'get',
		error: function(xhr, status, error) {
			console.log(error);
		},
		success: function(data) {
			console.log(data);
		}
	});

})()