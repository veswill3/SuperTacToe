import React, { Component } from 'react';
import uuid from 'uuid/v1';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  onDbUpdate,
  createGame,
  joinGame,
  makeMove,
} from './FirebaseUtil';
import Board from './Board';

const NewGameButton = () => (
  <button
    onClick={async () => {
      const token = uuid();
      try {
        const { id: newId } = await createGame(token);
        localStorage.setItem(newId, token);
        window.location = `${window.location.origin}/?id=${encodeURIComponent(newId)}`;
      } catch (error) {
        console.log(error);
      }
    }}
  >
    Start a new game
  </button>
);

class App extends Component {
  state = {
    id: null,
    token: null,
    role: null,
    game: null,
    copied: false,
  };

  componentWillMount() {
    // started from https://stackoverflow.com/a/901144/1644992
    const getIdQueryParam = () => {
      const results = /[?&]id(=([^&#]*)|&|#|$)/.exec(window.location.href);
      if (!results || !results[2]) return null;
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };
    const id = getIdQueryParam('id');
    if (!id) return;

    let token = localStorage.getItem(id);
    if (!token) {
      token = uuid();
      localStorage.setItem(id, token);
    }
    this.setState({ id, token });
  }

  componentDidMount() {
    const { id, token } = this.state;
    if (!id) return;

    // subscribe to updates
    onDbUpdate(id, update => this.setState({ game: update }));
    // attempt to join the game and get our role
    joinGame(id, token)
      .then(({ role }) => this.setState({ role }))
      .catch(() => this.setState({ role: 'spectator' })); // whatever
  }

  render() {
    const {
      id,
      token,
      role,
      game,
      copied,
    } = this.state;

    const whosTurn = game ? ((game.turns % 2) + 1) : 1;
    const yourTurn = !!(
      role && game && (
        (role === 'playerOne' && whosTurn === 1) ||
        (role === 'playerTwo' && whosTurn === 2)
      ));

    let yourRoleText = '';
    let yourRoleClass = '';
    if (role === 'playerOne') {
      yourRoleText = 'You are Player One';
      yourRoleClass = 'p1';
    } else if (role === 'playerTwo') {
      yourRoleText = 'You are Player Two';
      yourRoleClass = 'p2';
    } else if (role === 'spectator') {
      yourRoleText = 'You are a spectator';
    }

    const isGameOver = game && game.winner !== 0;

    return (
      <div id="container">
        <h1>SuperTacToe</h1>
        {id ?
          <div>
            {game && game.status === 'joining' &&
              <div>
                <p>
                  You need a friend to play. Send them a link to this page.
                </p>
                <CopyToClipboard
                  text={`Join me for a game of SuperTacToe at ${window.location.href}`}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <button>{copied ? 'Linked copied' : 'Click here to copy the link'}</button>
                </CopyToClipboard>
              </div>
            }
            <h2 className={yourRoleClass}>{yourRoleText}</h2>
            <Board
              state={game}
              yourTurn={yourTurn}
              onMove={(N, n) => makeMove(id, token, [N, n])}
            />
            {!isGameOver && role !== 'spectator' &&
              <h2 className={`p${whosTurn}`}>
                {yourTurn ? 'Your Turn' : 'Wait on opponent...'}
              </h2>
            }
            {isGameOver &&
              <div>
                <h2 className={`p${game.winner}`}>
                  {game.winner === 1 ? 'Player one wins!' : 'Player two wins!'}
                </h2>
                <NewGameButton />
              </div>
            }
          </div>
          :
          <NewGameButton />
        }

        <h2>How to play</h2>
        <p>
          SuperTacToe is a nested game of tic-tac-toe where each big tile contains a small game of
          tic-tac-toe inside of it. The game is won when someone wins the big game. In order to win
          tiles of the big game, you must win the small game inside of it.
        </p>
        <p>
          You cannot move just anywhere though - You can only make a move in the big tile
          corresponding to the previous move&#39;s little tile. Similarly, your move will send your
          opponent to a specific big tile that corresponds to your move. If someone is sent to a big
          tile that is already won or full, they can make a move in any other open tile.
        </p>
        <p>
          If that sounds confusing, play a practice game and it will make sense.
        </p>

      </div>
    );
  }
}

export default App;
