// Símbolo das bombas encontradas
const FLAG = "!";
// Seletor do elemento onde mostrar os passos da solução
const DISPLAY_ELM = "#exibir-execucao";

window.addEventListener("load", () => {
  const campoMinado = new CampoMinado();
  const board = new VirtualBoard(campoMinado); // Imagine que é um "Virtual DOM"
  const magawa = new Solver(board);
  magawa.sniff();
});
