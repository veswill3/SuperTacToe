import firebase from 'firebase';

const databaseURL = 'https://supertactoe-147e8.firebaseio.com';
const createURL = 'https://us-central1-supertactoe-147e8.cloudfunctions.net/createGame';
const joinURL = 'https://us-central1-supertactoe-147e8.cloudfunctions.net/joinGame';
const moveURL = 'https://us-central1-supertactoe-147e8.cloudfunctions.net/move';

const onDbUpdate = (id, callback) => {
  // initialize database connection
  firebase.initializeApp({ databaseURL });
  // subscribe to updates
  firebase.database().ref(`games/${id}`).on('value', snapshot => callback(snapshot.val()));
};

const nFetch = (url, dataToSend) => new Promise((resolve, reject) => {
  const init = {
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    method: 'POST',
    body: JSON.stringify(dataToSend),
  };
  fetch(url, init)
    .then(response => response.json()
      .then((data) => {
        if (response.status === 200) {
          return resolve(data);
        }
        return reject({ status: response.status, error: data });
      }))
    .catch(e => reject({ error: e }));
});

// returns { id: ID }
const createGame = token => nFetch(createURL, { token });
// returns { role: ROLE } where ROLE in 'playerOne', 'playerTwo', 'spectator'
const joinGame = (id, token) => nFetch(joinURL, { id, token });
// return { success: BOOL }
const makeMove = (id, token, move) => nFetch(moveURL, { id, token, move });

export {
  onDbUpdate,
  createGame,
  joinGame,
  makeMove,
};
