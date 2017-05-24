console.log("Hello World from main.js!");


// ajax send form data to back end

var myGameApi = (function() {

	console.log("myGameApi")

	let URL = 'http://dev.peternormandev.com/';
	
	function submitGame(e){ //Post a list of games
		e.preventDefault();
		console.log("submit new game!")


		var gameCat = $("[name='game-catagory']").val();
		var gameLocation = $("[name='location']").val();
		var gameDate = $("[name='date']").val();
		var gameTime = $("[name='time']").val();
		var gameMsg = $("[name='textarea']").val();

		$.ajax( URL + "games", {
			method: "post",
			data: {
				category:gameCat,
				location:gameLocation,
				date:gameDate,
				time:gameTime,
				msg:gameMsg
			}
		}).done(function(data, textStatus, jqXHR) {
			console.log(data, textStatus, jqXHR);

		}).fail(function(jqXHR, textStatus, errorThrown) {
		   console.error(textStatus, errorThrown)
		})
	}

	$("[name='post-game']").on("submit", submitGame)


	// function getGames(){ //Get a list of games
	// 	$.get( URL, function( data ) {
	// 		console.log("GET success", data);
	// 	}).fail(function(jqXHR, textStatus, errorThrown) {
	// 	   console.error(textStatus, errorThrown)
	// 	})
	// }
}());