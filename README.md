# Um "solucionador parcial" de Campo Minado

Algoritmo criado para desafio técnico em processo de candidatura de estágio.

[![b06af5678d3544efbaac2b17bf2e3f38.png](https://i.postimg.cc/J0SmzWnk/b06af5678d3544efbaac2b17bf2e3f38.png)](https://postimg.cc/dZRg5pGs)

1. [Considerações iniciais](#considerações-iniciais)
2. [Single Point](#single-point)
3. [Arquitetura](#arquitetura)
4. [Procedimento](#procedimento)
5. [MoveQueue](#movequeue)
6. [AFM & AMN](#all-free-neighbours-afn--all-mine-neighbours-amn)
7. [Glossário](#glossário)
8. [Referências](#referências)
9. [Trivia](#trivia)

# Considerações iniciais 

O enunciado solicita um algoritmo capaz de solucionar uma configuração de um jogo de Campo Minado, com o critério de que o código não faça uso de informação sobre a especificidade dessa configuração para encontrar a solução.

Para a minha estratégia me inspirei no algoritmo Single Point Strategy apresentado por Kasper Pedersen no seu artigo ["The complexity of Minesweeper and strategies for game playing"][1] de 2004. Também foi importante para me orientar na interpretação do artigo de Pedersen e na construção do programa o artigo ["Algorithmic Approaches to Playing Minesweeper"][2] de David J. Becerra, de 2015.

# Single Point

Essa estratégia que avalia uma célula por vez, tentando fazer deduções à respeito de seus vizinhos antes de considerar outras células. Usando deduções triviais com informação dos rótulos de uma célula alvo e seus vizinhos, jogadas seguras que abrem ou assinalam outras células vão sendo incluidas em uma fila de jogadas. Caso nenhuma jogada segura seja encontrada, uma célula aleatória do tabuleiro é aberta. 

# Arquitetura

O código segue um padrão OOP com classes para cada estrutura importante da aplicação (VirtualBoard, MoveQueue, Solver). Há um arquivo para cada classe, e um arquivo inicializador (index.js).

Uma instância da classe VirtualBoard que é inicializada com uma instância de CampoMinado serve como intermediário das operações realizadas, só acessando CampoMinado quando uma jogada de abertura de célula é realizada. Isso foi feito pois a classe CampoMinado não deveria ser alterada, como estipulado pelo enunciado, e a única interface que retorna informação do tabuleiro retorna uma string. 

# Procedimento

No primeiro passo todo o tabuleiro é explorado, e todas as [células de fronteira](#Glossário) são encontradas e verificadas por ```checkNeighbour()``` que usa as deduções AFN e AMN para criar uma lista de jogadas. 

Em seguida o programa entra no loop primário do algoritmo. 

Uma jogada do topo da lista é removida e executada. Se a jogada é do tipo "marcar bomba", nada mais é feito. Se a jogada é do tipo "abrir célula", então seus vizinhos são verificados e novas deduções AFN e AMN são feitas, acrescentando novas jogadas encontradas na fila de jogadas. 

Caso a fila de jogadas se esvazie, uma nova rodada de exploração é acionada, e caso não produza novas jogadas, uma célula aleatória no tabuleiro é aberta. Esse ciclo continua até que o status do jogo mude, encontrando uma bomba ou vencendo o jogo.

# MoveQueue

Fila semi-prioritária que dá preferência a jogadas do tipo "marcar bomba". 

Em [teoria da informação][3], eventos com baixa probabilidade (com alto valor de "surpresa") contém mais informação. Portanto, enquanto a densidade de bombas do tabuleiro for menor do que 0.5, saber onde estão as bombas tem maior valia do que saber onde estão células livres.

Um extrato do artigo de Pedersen sobre essa estrutura:

> "Since the strategy only attempts to discover new moves immediately following a move (x, b) it is important that as much information about the neighbourhood of x as possible is available. A priority queue based on simple information theory, which states that knowing something that has a low probability conveys more information than knowing something that has a high probability, is implemented"

# All Free Neighbours (AFN) & All Mine Neighbours (AMN)

Quando o rótulo da célula é igual ao número de vizinhos assinalados, então é trivial concluir que todos os vizinhos desconhecidos são livres. 

```js
const isAFN = label(cell) === markedNeighbours(cell);
```

Quando o número de vizinhos fechados não assinalados é igual ao rótulo da célula, então é trivial concluir que todos esses vizinhos são bombas. 

```js
const isAMN = label(cell) === unmarkedNeighbours(cell);
```
# Glossário:
1. Célula aberta: célula que foi sondada em jogada anterior.
2. Célula fechada: célula que ainda não foi sondada.
3. Célula assinalada/marcada: célula que foi identificada como possuindo uma bomba.
4. Célula não assinalada/marcada: célula fechada de conteúdo desconhecido.
5. Célula de fronteira: células abertas que possuem bombas adjacentes. Estão na "fronteira" entre a parte aberta e a parte fechada do tabuleiro.

# Referências

[Pedersen, K.. “The complexity of Minesweeper and strategies for game playing.” (2004).](https://www.semanticscholar.org/paper/The-complexity-of-Minesweeper-and-strategies-for-Pedersen/20833f71d74ff26ffd18979796cf1cbc8b3d92e6)

[Becerra, David J. 2015. Algorithmic Approaches to Playing Minesweeper. Bachelor's thesis, Harvard College.](http://nrs.harvard.edu/urn-3:HUL.InstRepos:14398552)

[Olshausen, Bruno A.. "Information Theory Primer." (2010).](https://redwood.berkeley.edu/courses/vs265-fall-2018/attachment/info-theory/)

https://github.com/ivory-it/ivoryit-testeestagio-campo-minado-js


[1]: https://www.semanticscholar.org/paper/The-complexity-of-Minesweeper-and-strategies-for-Pedersen/20833f71d74ff26ffd18979796cf1cbc8b3d92e6

[2]: http://nrs.harvard.edu/urn-3:HUL.InstRepos:14398552

[3]: https://redwood.berkeley.edu/courses/vs265-fall-2018/attachment/info-theory/  

# Trivia

Magawa: https://www.bbc.com/news/world-asia-57345703
