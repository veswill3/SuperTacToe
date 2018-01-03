const gamesById = {};

let nextGameId = 1000;
const newGame = (client) => {
  const game = {
    id: nextGameId,
    clients: [client],
    state: {
      winner: null,
      turns: 0,
      lastmove: [-1, -1], // [super, sub]
      board: Array(9).fill({
        playable: true, // first move can be anywhere
        status: 'open', // full, 1, 2
        tiles: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      }),
    },
  };
  gamesById[nextGameId] = game;
  nextGameId += 1;
  return game;
};

const checkWin = (p, b) => (
  (b[0] === p && b[1] === p && b[2] === p) || // top
  (b[3] === p && b[4] === p && b[5] === p) || // mid
  (b[6] === p && b[7] === p && b[8] === p) || // bottom
  (b[0] === p && b[3] === p && b[6] === p) || // left
  (b[1] === p && b[4] === p && b[7] === p) || // mid
  (b[2] === p && b[5] === p && b[8] === p) || // right
  (b[0] === p && b[4] === p && b[8] === p) || // diagonal \
  (b[6] === p && b[4] === p && b[2] === p) // diagonal /
);

// returns open, full, 1, or 2 (winners)
const getStatus = (player, tiles) => {
  if (checkWin(player, tiles)) return player;
  if (tiles.some(t => t === 0)) return 'open';
  return 'full';
};

// send an update to everyone watching this game
const sendUpdate = (game) => {
  game.clients.forEach((client, cliNum) => {
    let player = false;
    if (client === game.clients[0]) player = 1;
    if (client === game.clients[1]) player = 2;
    client.send(
      JSON.stringify({
        id: game.id,
        state: game.state,
        whosTurn: (game.state.turns % 2) + 1,
        youArePlayer: player,
        showLink: !game.clients[0] || !game.clients[1],
      }),
      (error) => {
        if (error) {
          game.clients[cliNum] = null;
          delete client.game;
          client.terminate();
        }
      },
    );
  });
};

const gameManager = (client, message) => {
  switch (message.type) {
    case 'NEW_GAME':
    case 'JOIN_GAME': {
      const game = message.gameId ? gamesById[message.gameId] : false;
      // missing or stale game - just start a new one
      if (!game || (!game.clients[0] && !game.clients[1])) {
        const newgame = newGame(client);
        client.game = newgame;
        sendUpdate(newgame);
        return;
      }
      if (!game.clients[0]) {
        // rejoin as p1
        game.clients[0] = client;
      } else if (!game.clients[1]) {
        // rejoin as p2
        game.clients[1] = client;
      } else {
        // game is full, join as a spectator
        game.clients.push(client);
      }
      client.game = game;
      sendUpdate(game);
      return;
    }
    case 'MOVE': {
      const { game } = client;
      if (!game) return;
      const { state } = game;
      if (client !== game.clients[state.turns % 2]) return; // not your turn
      const [mT, mt] = message.move;
      // validate the move
      if (mT > 8 || mT < 0 || mt > 8 || mt < 0) return; // out of bounds
      if (!state.board[mT].playable) return; // not playable supertile
      if (state.board[mT].tiles[mt] !== 0) return; // spot is taken
      if (state.winner) return; // game is over
      const player = (state.turns % 2 === 0) ? 1 : 2;

      // update that spot
      const board = state.board.map((T, N) => {
        if (N === mT) {
          const newTiles = T.tiles.map((t, n) => ((mt === n) ? player : t));
          return {
            ...T,
            tiles: newTiles,
            status: getStatus(player, newTiles),
          };
        }
        return { ...T };
      });

      // check for a winner
      const winner = checkWin(player, board.map(T => T.status)) ? player : false;

      // update where you can go next
      board.forEach((T, N) => {
        if (winner) {
          // game is over, no moves anywhere
          T.playable = false;
          return;
        }
        if (board[mt].status === 'open') {
          T.playable = N === mt;
        } else {
          // all open spaces are playable
          T.playable = T.status === 'open';
        }
      });

      game.state = {
        winner,
        turns: state.turns + 1,
        lastmove: [mT, mt],
        board,
      };
      sendUpdate(game);
      return;
    }
    case 'RESTART': {
      const { game } = client;
      if (client !== game.clients[0] && client !== game.clients[1]) return;
      game.state = {
        winner: null,
        turns: 0,
        lastmove: [-1, -1], // [super, sub]
        board: Array(9).fill({
          playable: true, // first move can be anywhere
          status: 'open', // full, 1, 2
          tiles: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        }),
      };
      sendUpdate(game);
      break;
    }
    default:
  }
};

module.exports = gameManager;
