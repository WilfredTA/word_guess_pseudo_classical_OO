var randomWord = (function() {
	var words = ["apple", "banana", "pear", "orange"];

	return function(){
			var word = words[Math.floor(Math.random() * words.length)]
			words.splice(words.indexOf(word), 1);
			return word;
		}


})();

var $letters = $("#spaces");
var $guesses = $("#guesses");
var $apples = $("#apples");
var $message = $("#message");

function Game() {
	this.incorrect = 0;
	this.letters_guessed = [];
	this.correct_spaces = 0;
	this.word = randomWord().split("");
	if (!this.word){
		this.displayMessage("Sorry, I've run out of words!")
	}
	this.init();

}

Game.prototype = {
	createBlanks: function() {
		var spaces = new Array(this.word.length + 1).join("<span></span>")
		$letters.find("span").remove();
		$letters.append(spaces);
		this.$spaces = $("#spaces span");
		
	},
	displayMessage: function(text){
		$message.text(text);
	},

	init: function() {
		this.createBlanks();
		this.letters_guessed = [];

		$(document).on("keypress", this.checkKey.bind(this));
	},

	checkKey: function(e){
		if (e.which < 97 || e.wich > 122){
			return;
		}
		var char = String.fromCharCode(e.which);

		if (this.letters_guessed.includes(char)){
			return;
		}

		this.letters_guessed.push(char);

		$guesses.append("<span>" + char + "</span>");
		this.populateGuessesAndWord(char);

	},
	populateGuessesAndWord: function(char){
		var indices = [];

		this.word.forEach(function(character, i){
			if (char === character){
				indices.push(i);
			}
		});

		if (indices.length === 0) {
			this.incorrect += 1;
			$apples.removeClass().addClass("guess_" + this.incorrect)
		} else {
			indices.forEach(function(integer){
				this.$spaces.eq(integer).text(char);
				this.correct_spaces += 1;
			}, this)
		};

		this.checkGameStatus();
	},

	checkGameStatus: function() {
		if (this.correct_spaces === this.word.length) {
			$("body").addClass('win');
			this.displayMessage("You have won!");
			this.endGame();
		} else if (this.incorrect >= 6) {
			$("body").addClass("lose");
			this.displayMessage("You have lost!");
			this.endGame();
		}
	},

	endGame: function() {
		$(document).unbind("keypress");
		$message.append("<a data-id='play-again' href='#'>Play Again? </a>");
		$(document).on("click", 'a', function(e){
			e.preventDefault();
			if ($(e.target).attr("data-id") === "play-again"){
				this.resetGame();
			}
		}.bind(this))
	},

	resetGame: function() {
		this.resetBoard();
		game = new Game();
	},

	resetBoard: function() {
		$message.text('');
		$guesses.find('span').remove();
		$apples.removeClass();
		$("body").removeClass();
	}
}

var game = new Game();