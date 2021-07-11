// Classe "maestro", responsável por orquestrar o uso das outras classes do algoritmo.
// Recebe uma instância de um VirtualBoard sobre a qual operar.

class Solver {
  constructor(board) {
    this.board = board; 
    Solver.display('--- Início do jogo ---');
  }

  sniff() {
    const moveQueue = new MoveQueue();

    // Como o tabuleiro está parcialmente aberto no início do jogo, o primeiro passo
    // é explorá-lo em busca de jogadas
    const firstMoves = this.explore();
    moveQueue.insert(...firstMoves);

    // Loop primário do algoritmo. Em resumo: tira uma jogada da fila de jogadas, 
    // atualiza tudo, procura outra jogada nos vizinhos da célula. Uma descrição
    // mais detalhada está inclusa na documentação do algoritmo.
    while (this.board.status === 0) {
      if (!moveQueue.size()) {
        let moreMoves = this.explore() || [this.randomMove()];
        moveQueue.insert(...moreMoves);
      }

      const nextMove = moveQueue.remove();
      this.board.makePlay(nextMove);

      this.board.update();
      Solver.display(`Jogada: [${nextMove.cell}] = ${this.board.label(nextMove.cell)}`);
      Solver.display(this.board.output());

      if (this.board.status === 2) {
        Solver.display("Game Over");
        return;
      }

      // Vizinhos de uma bomba não são verificados. Pule para a próxima iteração. 
      if (nextMove.type === "mark_bomb") {
        continue;
      }

      // Verifique os vizinhos de nextMove.cell.
      const neighbours = VirtualBoard.getNeighbours(nextMove.cell);

      for (let n of neighbours) {
        const moves = this.checkNeighbours(n); 
        moves.map((entry) => {
          moveQueue.insert(entry);
        });
      }
    }

    if (this.board.status === 1) {
      Solver.display("Win");
    }

    return;

  }

  // msg: string
  static display(msg) {
    const el = document.querySelector(DISPLAY_ELM);
    el.innerHTML += `<pre>${msg}</pre>`;
  }

  // Faz uma busca por células de fronteira (células abertas com rótulo > 0) e
  // procura jogadas entre elas.

  // returns Move[]: [{ cell: Cell, type: string }]
  explore() {
    const foundMoves = new MoveQueue();
    this.board.updateFrontier();

    while (this.board.frontier.length) {
      const cell = this.board.frontier.pop();
      const moves = this.checkNeighbours(cell);
      moves.map((entry) => {
        foundMoves.insert(entry);
      });
    }

    return foundMoves.queue;
  }

  // Retorna uma jogada de abertura de célula com uma célula aleatória

  // returns Move: { cell: Cell, type: string }
  randomMove() {
    return { cell: VirtualBoard.pickCell(), type: "probe_cell" };
  }

  // Busca por inferências do tipo All Free Neighbours e All Mines
  // Neighbours fazendo calculos com o valor do rótulo, número de bombas já encontradas,
  // e número de vizinhos ainda não explorados. Mais detalhes na documentação.

  // cell: [number, number], returns Move[]
  checkNeighbours(cell) {
    const label = +this.board.label(cell);
    const marked = this.board.markedNeighbours(cell);
    const unmarked = this.board.unmarkedNeighbours(cell);

    if (label === marked.length) {
      return unmarked.map((entry) => ({ cell: entry, type: "probe_cell" }));
    }

    else if (label === (marked.length + unmarked.length)) {
      return unmarked.map((entry) => ({ cell: entry, type: "mark_bomb" }));
    }

    return [];
  }
}
