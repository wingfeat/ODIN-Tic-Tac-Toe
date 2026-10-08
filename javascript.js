function createPlayer(name, marker) {
  return {
    name,
    marker,
    sayHello() {
      console.log(
        `Hi ${name.toUpperCase()} you choose ${marker.toUpperCase()}`,
      );
    },
  };
}

const gameBoard = (() => {
  let board = [];

  const addMarker = (index, marker) => {
    board[index] = marker;
  };

  const resetBoard = () => {
    board = [];
  };

  const getBoard = () => board;

  return { addMarker, resetBoard, getBoard };
})();

const gameController = (() => {
  const player1 = createPlayer("player 1", "x");
  const player2 = createPlayer("player 2", "O");
  let isGameOver = false;

  player1.sayHello();
  player2.sayHello();

  let currentPlayer = player1;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinningCombos = () => {
    const board = gameBoard.getBoard();
    const displayResult = document.querySelector(".result");

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];

      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        displayResult.textContent = `${currentPlayer.name.toUpperCase()} has won !!!`;
        isGameOver = true;
        return;
      }
    }

    let filledCells = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i]) filledCells++;
    }

    if (filledCells === 9) {
      displayResult.textContent = "It's a tie !";
      isGameOver = true;
    }
  };

  const resetGame = () => {
    isGameOver = false;
    currentPlayer = player1;
    document.querySelector(".result").textContent = "";
    gameBoard.resetBoard();
  };

  const playRound = (index) => {
    const board = gameBoard.getBoard();

    if (isGameOver === true) return;

    if (!board[index]) {
      gameBoard.addMarker(index, currentPlayer.marker);
    } else return false;

    checkWinningCombos();

    if (!isGameOver) {
      switchPlayer();
    }
  };

  return { switchPlayer, checkWinningCombos, playRound, resetGame };
})();

const handleDOM = (() => {
  const cell = document.querySelectorAll(".cell");

  cell.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      gameController.playRound(cell.dataset.index);

      const board = gameBoard.getBoard();

      cell.textContent = board[cell.dataset.index];
    });
  });

  addEventListener("click", (event) => {
    if (event.target.classList.contains("restart")) {
      gameController.resetGame();
      cell.forEach((cell) => {
        cell.textContent = "";
      });
      return true;
    }
  });
})();
