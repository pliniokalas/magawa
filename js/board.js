// Cópia do tabuleiro do jogo usado para facilitar as operações que são realizadas
// pelo algoritmo. 

// Cell: [number, number]
// Board: string[][]
// Flags: Cell[]
// Frontier: Cell[]
// Status: int
class VirtualBoard {
  constructor(campoMinado) {
    this.cells = new Array(9);
    for (let i=0; i<9; i++) {
      this.cells[i] = new Array(9);
    }

    this.flags = [];
    this.frontier = [];
    this.status = 0;
    this.campoMinado = campoMinado; 

    this.update();
  }

  // cell: Cell, returns string
  label(cell) {
    const [x, y] = cell;
    return this.cells[y][x];
  }

  // Reconsciliação entre o VirtualBoard e o CampoMinado.
  update() {
    this.status = this.campoMinado.JogoStatus();
    this.cells = VirtualBoard.parseBoard(this.campoMinado.Tabuleiro());

    // Add back the overwritten flags
    for (let i=0; i<this.flags.length; i++) {
      const [x, y] = this.flags[i];
      this.cells[y][x] = "!";
    }
  }

  // Gera uma string para renderização da instância do VirtualBoard.

  // returns string
  output() {
    let str = "  ";

    for (let i=0; i<this.cells.length; i++) {
      str += " " + i;
    }

    str += "\n" + "   ";

    for (let i=0; i<this.cells.length; i++) {
      str += "--";
    }

    str += "\n";

    for (let i=0; i<this.cells.length; i++) {
      str += i + "| " + this.cells[i].join(" ") + "\n";
    }

    return str; 
  }

  // Executa a jogada. Jogadas mark_bomb são apenas executadas na instãncia do
  // VirtualBoard, enquanto jogadas probe_cell precisam atualizar o campoMinado.

  // move: { cell: Cell, type: string }
  makePlay(move) {
    const [x, y] = move.cell;

    if (move.type === "mark_bomb") {
      this.flags.push([x, y]);
    }

    else if (move.type === "probe_cell") {
      this.campoMinado.Abrir(y+1, x+1);
    }
  }

  // Faz uma busca em todo tabuleiro e coleta as "células de fronteira", células abertas
  // que têm rótulo > 0, e portanto possuem uma bomba adjacente.
  
  updateFrontier() {
    this.frontier = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (+this.cells[row][col] > 0) {
          this.frontier.push([col, row]);
        }
      }
    }
  }

  // Busca uma célula fechada aleatória no tabuleiro.

  // returns Cell
  static pickCell() {
    let candidates = [];

    // find 
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "-") {
          candidates.push([col, row]);
        }
      }
    }

    // choose
    const index = Math.floor(Math.random() * candidates.length);

    return candidates[index];
  }

  // Verifica as 8 células adjacentes à cell, considerando os limites do tabuleiro,
  // e retorna uma lista das células válidas

  // cell: Cell, returns Cell[]
  static getNeighbours(cell) {
    const [x, y] = cell;
    const neighbours = [];

    for (let row = y-1; row <= y+1; row++) {
      for (let col = x-1; col <= x+1; col++) {
        if (row >= 0 && row < 9 && col >= 0 && col < 9) {
          neighbours.push([col, row]);
        }
      }
    }

    return neighbours;
  }

  // Filtra a lista de vizinhos de cell, retornando apenas os vizinhos fechados e não
  // marcados, ou apenas os vizinhos fechados marcados

  // mode: string, cell: Cell, returns Cell[]
  _getSomeNeighbours(mode, cell) {
    const check = (mode === "unmarked") ? "-" : FLAG;
    const neighbours = VirtualBoard.getNeighbours(cell);
    const someNeighbours = neighbours.filter(([x, y]) => this.cells[y][x] === check)

    return someNeighbours;
  }

  // aliases

  unmarkedNeighbours(cell) {
    return this._getSomeNeighbours("unmarked", cell);
  }

  markedNeighbours(cell) {
    return this._getSomeNeighbours("marked", cell);
  }

  // Transforma a string retornada por CampoMinado.Tabuleiro() em um array 2d (Board)

  // boardStr: string, returns Board 
  static parseBoard(boardStr) {
    const board = [];
    const boardArr = boardStr
      .split("")
      .filter(char => char !== "\r" && char !== "\n");

    let i = 0;
    for (let row = 0; row < 9; row++) {
      board[row] = new Array(9);
      for (let col=0; col<9; col++) {
        board[row][col] = boardArr[i++];
      }
    }

    return board;
  }
}
