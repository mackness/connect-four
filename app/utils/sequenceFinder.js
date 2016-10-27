import _ from 'lodash';

/**
 * vertical horizontal and diagonal sequence finders
 * @param {Array} 7x5 array that represents the board
 * @return {Boolean}
 */

var vertical = (board) => {
  for(var i=0;i<board.length;i++) {
    for(var j=0;j<board[i].length;j++) {
      if (_.has(board[i][j], 'val') && _.has(board[i][j+1], 'val') && _.has(board[i][j+2], 'val') && _.has(board[i][j+3], 'val')) {
        if (board[i][j].val == board[i][j+1].val&&board[i][j].val == board[i][j+2].val&&board[i][j].val == board[i][j+3].val) {
          return true
        }
      }
    }
  }
}

var horizontal = (board) => {
  for(var i=0;i<4;i++) {
    for(var j=0;j<board[i].length;j++) {
      if (_.has(board[i][j], 'val') && _.has(board[i+1][j], 'val') && _.has(board[i+2][j], 'val') && _.has(board[i+3][j], 'val')) {
        if (board[i][j].val == board[i+1][j].val&&board[i][j].val == board[i+2][j].val&&board[i][j].val == board[i+3][j].val) {
          return true
        }
      }
    }
  }
}

var diagonal = (board) => {
  for(var i=0;i<4;i++) {
    for(var j=0;j<4;j++) {
      if (_.has(board[i][j], 'val') && _.has(board[i+1][j+1], 'val') && _.has(board[i+2][j+2], 'val') && _.has(board[i+3][j+3], 'val')) {
        if (board[i][j].val == board[i+1][j+1].val&&board[i][j].val == board[i+2][j+2].val&&board[i][j].val == board[i+3][j+3].val) {
          return true
        }
      }
    }
  }
}

var reverseDiagonal = (board) => {
  for(var i=3;i<7;i++) {
    for(var j=0;j<4;j++) {
      if (_.has(board[i][j], 'val') && _.has(board[i-1][j+1], 'val') && _.has(board[i-2][j+2], 'val') && _.has(board[i-3][j+3], 'val')) {
        if (board[i][j].val == board[i-1][j+1].val&&board[i][j].val == board[i-2][j+2].val&&board[i][j].val == board[i-3][j+3].val) {
          return true
        }
      }
    }
  }
}

export { vertical, horizontal, diagonal, reverseDiagonal }










