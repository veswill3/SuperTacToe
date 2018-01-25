const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.createGame = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (!req.body.token) return res.status(400).json('Missing token');
    return admin.database().ref('/games').push({
      status: 'joining',
      winner: 0,
      turns: 0,
      lastmove: [-1, -1], // [super, sub]
      board: Array(9).fill({
        playable: true, // first move can be anywhere
        status: 'open', // full, 1, 2
        tiles: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      }),
    })
      .then((snapshot) => {
        const id = snapshot.key;
        return admin.database().ref(`/tokens/${id}`).set({
          playerOne: req.body.token,
        })
          .then(() => res.json({ id }));
      })
      .catch(() => res.status(400));
  });
});

exports.joinGame = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const { id, token } = req.body;
    if (!id) return res.status(400).json('Missing id');
    if (!token) return res.status(400).json('Missing token');
    return admin.database().ref(`/tokens/${id}`).once('value').then((snap) => {
      const { playerOne, playerTwo } = snap.val();
      if (token === playerOne) return res.json({ role: 'playerOne' });
      if (token === playerTwo) return res.json({ role: 'playerTwo' });
      if (!playerTwo) {
        return admin.database().ref(`/tokens/${id}/playerTwo`).set(token)
          .then(() => {
            admin.database().ref(`/games/${id}/status`).set('playing');
            return res.json({ role: 'playerTwo' });
          });
      }
      return res.json({ role: 'spectator' });
    })
      .catch(() => res.status(400));
  });
});

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

const gameReducer = (state, move) => {
  const mT = +move[0];
  const mt = +move[1];
  if (mT > 8 || mT < 0 || mt > 8 || mt < 0) return state; // out of bounds
  if (!state.board[mT].playable) return state; // not playable supertile
  if (state.board[mT].tiles[mt] !== 0) return state; // spot is taken
  if (state.winner) return state; // game is over
  const player = (state.turns % 2 === 0) ? 1 : 2;

  // update that spot
  const board = state.board.map((T, N) => {
    if (N === mT) {
      const newTiles = T.tiles.map((t, n) => ((mt === n) ? player : t));
      return Object.assign({}, T, {
        tiles: newTiles,
        status: getStatus(player, newTiles),
      });
    }
    return Object.assign({}, T);
  });

  // check for a winner
  const winner = checkWin(player, board.map(T => T.status)) ? player : 0;

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

  return Object.assign({}, state, {
    winner,
    turns: state.turns + 1,
    lastmove: [mT, mt],
    board,
  });
};

exports.move = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const { id, token, move } = req.body;
    if (!id) return res.status(400).json('Missing id');
    if (!token) return res.status(400).json('Missing token');
    if (!move || !move.length || move.length !== 2) return res.status(400).json('Missing move');
    const gameRef = admin.database().ref(`/games/${id}`);
    const tokenRef = admin.database().ref(`/tokens/${id}`);
    return Promise.all([gameRef.once('value'), tokenRef.once('value')])
      .then((resp) => {
        const game = resp[0].val();
        const tokens = resp[1].val();
        const whosTurn = game.turns % 2 === 0 ? 'playerOne' : 'playerTwo';
        if (token !== tokens[whosTurn]) return res.status(400).json({ error: 'Not your turn' });
        const updatedGame = gameReducer(game, move);
        if (updatedGame === game) return res.json({ success: false });
        return gameRef.set(updatedGame).then(() => res.json({ success: true }));
      })
      .catch(() => res.status(400));
  });
});
