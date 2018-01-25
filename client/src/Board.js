import React from 'react';
import PropTypes from 'prop-types';

const Board = ({
  state,
  yourTurn,
  onMove,
}) => {
  if (!state) {
    return (<h3>Loading...</h3>);
  }
  return (
    <div
      id="board"
      className={state.winner ? `p${state.winner}-winner` : `p${(state.turns % 2) + 1}-turn`}
    >
      {state.board.map((T, N) => {
        let superClass = (+T.status > 0) ? `p${T.status}` : T.status;
        if (T.playable) superClass += ' playable';
        return (
          <div
            key={`supertile-${N}`}
            className={superClass}
          >
            {T.tiles.map((t, n) => {
              let subClass = (t > 0) ? `p${t}` : '';
              if (N === state.lastmove[0] && n === state.lastmove[1]) {
                subClass += ' last';
              }
              return (
                <div
                  key={`subtile-${n}`}
                  className={subClass}
                  onClick={(yourTurn && T.playable && t === 0) ? () => onMove(N, n) : null}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

Board.propTypes = {
  state: PropTypes.shape({
    board: PropTypes.arrayOf(PropTypes.shape({
      playable: PropTypes.bool.isRequired,
      status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      tiles: PropTypes.arrayOf(PropTypes.number).isRequired,
    })).isRequired,
    lastmove: PropTypes.arrayOf(PropTypes.number).isRequired,
    status: PropTypes.string.isRequired,
    turns: PropTypes.number.isRequired,
    winner: PropTypes.number.isRequired,
  }),
  yourTurn: PropTypes.bool.isRequired,
  onMove: PropTypes.func.isRequired,
};

Board.defaultProps = {
  state: null,
};

export default Board;
