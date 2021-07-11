// Fila de jogadas com uma preferência por jogadas que marcam células com bombas.

class MoveQueue {
  // Move: { cell: [number, number], type: string }
  constructor() {
    this._queue = [];
  }

  // returns Move[]
  get queue() {
    return this._queue;
  }

  // newQueue: Move[]
  set queue(newQueue) {
    this._queue = [...newQueue];
  }

  // Evita duplicação de jogadas na fila.

  // move: Move, returns bool
  exists(move) {
    return this.queue.some(entry => entry.cell.toString() === move.cell.toString());
  }

  // Insere jogadas do tipo "mark_bomb" em cima e "probe_cell" em baixo

  // move: Move
  insert(move) {
    if (move && !this.exists(move)) {
      if (move.type === "mark_bomb") {
        this.queue.unshift(move);
      }
      else if (move.type === "probe_cell") {
        this.queue.push(move);
      }
    }
  }

  // FIFO

  // returns Move
  remove() {
    return this.queue.shift(); 
  }

  // returns int
  size() {
    return this.queue.length;
  }
}
