/** @jsx React.DOM */

(function() {

	var Game = React.createClass({

		shuffle: function(array) {

			// switches first two tiles
			function switchTiles(array) {
				var i = 0;

				// find the first two tiles in a row
				while (!array[i] || !array[i+1]) i++;

				// store tile value
				var tile = array[i];
				// switche values
				array[i] = array[i+1];
				array[i+1] = tile;

				return array;
			}

			// counts inversions
			function countInversions(array) {
				// make array of inversions
				var invArray = array.map(function(num, i) {
					var inversions = 0;
					for (j = i + 1; j < array.length; j++) {
						if (array[j] && array[j] < num) {
							inversions += 1;
						}
					}
					return inversions;
				});
				// return sum of inversions array
				return invArray.reduce(function(a, b) {
				    return a + b;
				});
			}

			// fischer-yates shuffle algorithm
			function fischerYates(array) {
			    var counter = array.length, temp, index;

			    // While there are elements in the array
			    while (counter > 0) {
			        // Pick a random index
			        index = Math.floor(Math.random() * counter);
			        // Decrease counter by 1
			        counter--;
			        // And swap the last element with it
			        temp = array[counter];
			        array[counter] = array[index];
			        array[index] = temp;
			    }

			    return array;
			}

			// Fischer-Yates shuffle
		    array = fischerYates(array);

		    // check for even number of inversions
		    if (countInversions(array) % 2 !== 0) {
		    	// switch two tiles if odd
		    	array = switchTiles(array);
		    }

			return array;
		},
		getInitialState: function() {
			return {
				// initial state of game board
				tiles: this.shuffle([
					1,2,3,
					4,5,6,
					7,8,''
				]),
				win: false
			};
		},
		checkBoard: function() {
			var tiles = this.state.tiles;

			for (var i = 0; i < tiles.length-1; i++) {
				if (tiles[i] !== i+1) return false;
			}

			return true;
		},
		tileClick: function(tile, position, status) {
			var tiles = this.state.tiles;
			// Possible moves
			// [up,right,down,left]
			// 9 = out of bounds
			var moves = [
				[null,1,3,null],[null,2,4,0],[null,null,5,1],
				[0,4,6,null],   [1,5,7,3],   [2,null,8,4],
				[3,7,null,null],[4,8,null,6],[5,null,null,7]
			];

			function animateTile(i) {
				var directions = ['up','right','down','left'];
				direction = directions[i];
				console.log(direction);
				tile.classList.add('move-' + direction);
				setTimeout(function() {
					tile.classList.remove('move-' + direction);
				}, 200);
			}

			// return if they've already won
			if (this.state.win) return;
			// check possible moves
			for (var i = 0; i < moves[position].length; i++) {
				var move = moves[position][i];
				// if an adjacent tile is empty
				if (typeof move === 'number' && !tiles[move]) {
					animateTile(i);
					setTimeout(function() {
						tiles[position] = '';
						tiles[move] = status;
						this.setState({
							tiles: tiles,
							moves: moves,
							win: this.checkBoard()
						});
					}.bind(this), 200);
					break;
				}
			}
		},
		restartGame: function() {
			this.setState(this.getInitialState());
		},
		render: function() {
			return <div>
				<div id="game-board">
					{this.state.tiles.map(function(tile, position) {
						return ( <Tile status={tile} key={position} tileClick={this.tileClick} /> );
					}, this)}
				</div>
				<Menu winClass={this.state.win ? 'button win' : 'button'} status={this.state.win ? 'You win!' : 'Solve the puzzle.'} restart={this.restartGame} />
			</div>;
		}
	});

	var Tile = React.createClass({
		clickHandler: function(e) {
			this.props.tileClick(e.target, this.props.key, this.props.status);
		},
		render: function() {
			return <div className="tile" onClick={this.clickHandler}>{this.props.status}</div>;
		}
	});

	var Menu = React.createClass({
		clickHandler: function() {
			this.props.restart();
		},
		render: function() {
			return <div id="menu">
				<h3 id="subtitle">{this.props.status}</h3>
				<a className={this.props.winClass} onClick={this.clickHandler}>Restart</a>
			</div>;
		}
	});

	// render Game to container
    React.renderComponent(
        <Game />,
        document.getElementById('game-container')
    );

}());