(function IIFE() {
  // get game ID from query parameter
  // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  function getIdParameter() {
    const regex = new RegExp('[?&]id(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  const gameId = getIdParameter();

  const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);

  const boardElement = document.getElementById('board');
  const turnSignalElement = document.getElementById('turn-signal');
  const linkMessageElement = document.getElementById('link-message');
  const linkElement = document.getElementById('link');
  linkElement.addEventListener('click', (e) => {
    e.target.select();
    document.execCommand('Copy');
    alert('copied to clipboard');
  });
  const startOverElement = document.getElementById('start-over');
  startOverElement.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'RESTART' }));
  });

  const udpateDisplay = ({
    id, state, whosTurn, youArePlayer, showLink,
  }) => {
    const fragment = document.createDocumentFragment();
    const yourTurn = whosTurn === youArePlayer;
    state.board.forEach((T, N) => {
      const superDiv = document.createElement('div');
      if ([1, 2].includes(T.status)) {
        superDiv.classList.add(`p${T.status}`);
      } else {
        superDiv.classList.add(T.status);
      }
      if (T.playable) {
        superDiv.classList.add('playable');
      }
      T.tiles.forEach((t, n) => {
        const subDiv = document.createElement('div');
        if (t > 0) subDiv.classList.add(`p${t}`);
        if (N === state.lastmove[0] && n === state.lastmove[1]) {
          subDiv.classList.add('last');
        }
        if (yourTurn && T.playable && t === 0) {
          subDiv.addEventListener('click', () => {
            socket.send(JSON.stringify({ type: 'MOVE', move: [N, n] }));
          });
        }
        superDiv.appendChild(subDiv);
      });
      fragment.appendChild(superDiv);
    });
    boardElement.innerHTML = '';
    boardElement.append(fragment);
    boardElement.className = (state.turns % 2 === 0) ? 'p1-turn' : 'p2-turn';

    if (state.winner) {
      turnSignalElement.innerHTML = `Player ${state.winner} wins!`;
      turnSignalElement.className = `p${state.winner}`;
    } else {
      turnSignalElement.innerHTML = yourTurn ? 'Your Turn' : `Waiting for Player ${whosTurn}`;
      turnSignalElement.className = `p${whosTurn}`;
    }

    linkMessageElement.style.display = showLink ? null : 'none';
    if (showLink) {
      const href = `${window.location.origin}/?id=${id}`;
      linkElement.value = href;
    }

    if (youArePlayer) {
      startOverElement.style.display = '';
    }
  };

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      udpateDisplay(data);
    } catch (error) {
      console.log(error);
    }
  });

  socket.addEventListener('open', () => {
    if (!gameId) {
      socket.send(JSON.stringify({
        type: 'NEW_GAME',
      }));
    } else {
      socket.send(JSON.stringify({
        type: 'JOIN_GAME',
        gameId,
      }));
    }
  });
}());
