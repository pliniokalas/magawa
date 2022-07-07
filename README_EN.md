# Magawa EN

# A "partial solver" for Minesweeper

Internship application challenge.

[![b06af5678d3544efbaac2b17bf2e3f38.png](https://i.postimg.cc/J0SmzWnk/b06af5678d3544efbaac2b17bf2e3f38.png)](https://postimg.cc/dZRg5pGs)

1. [Foreword](#foreword)
2. [Single Point](#single-point)
3. [Architecture](#architecture)
4. [Procedure](#procedure)
5. [MoveQueue](#movequeue)
7. [AFM & AMN](#all-free-neighbours-afn--all-mine-neighbours-amn)
8. [Glossary](#glossary)
9. [References](#references)
10. [Trivia](#trivia)

# Foreword

The test asks for an algorithm capable of solving a specific configuration of a game of Minesweeper. The program mustn't use the specificity of this configuration to solve it.

This strategy was inspired by the Single Point Strategy algorithm presented by Kasper Pedersen in his article ["The complexity of Minesweeper and strategies for game playing"][1] from 2004. David J. Becerra's 2015 article ["Algorithmic Approaches to Playing Minesweeper"][2] was also vital in both clarifying Pedersen's text and guiding the construction of this solution.

# Single Point

This strategy evaluates a single cell at a time, attempting to infer information about its neighbors before evaluating other cells. Safe moves found in this evaluation are put in a queue. If no safe move is found, a random cell in the board is open.

# Architecture

The code attempts to implement OOP patterns, with each important structure (VirtualBoard, MoveQueue, Solver) represented by a class; each contained in a file, and the main file in `index.js`.

An instance of the VitrtualBoard class containing an instance of the CampoMinado class works as a stand-in for most of the operations, only calling CampoMinado when the opening move is made. This was done so the CampoMinado class could be kept unaltered, as requested by the challenge.

# Procedure

In the first step, all the board is explored, and all the [frontier cells](#glossary) are identified and then checked using AFN and AMN inferences. This results in a move queue.

Next, the program goes into its primary loop.

A move is dequeued and executed. If the move is of the type "flag bomb" nothing else is done. If it is of type "open cell", then its neighbors are checked and new AFN and AMN inferences are made, adding any resulting moves to the queue.

If the queue is empty, a new exploration round is performed, and if it does not produce new moves, a random cell in the board is opened. This cycle repeats until the game state changes by finding a bomb or winning the game.

# MoveQueue

Priority(-ish) queue with a preference for "flag bomb" type moves.

In [information theory][3], events with low probability (high "surprise" value) contain more information. Therefore, if the density of bombs on the board is less than 0.5, knowing where the bombs are is more valuable than knowing where the open cells are.

An excerpt from Pedersen's article on this structure:

> "Since the strategy only attempts to discover new moves immediately following a move (x, b) it is important that as much information about the neighbourhood of x as possible is available. A priority queue based on simple information theory, which states that knowing something that has a low probability conveys more information than knowing something that has a high probability, is implemented"

# All Free Neighbours (AFN) & All Mine Neighbours (AMN)

When the cell label is equal to the number of flagged neighbors, it is trivial that all unknown neighbors are open.

```js
const isAFN = label(cell) === markedNeighbours(cell);
```

When the number of unflagged neighbors is equal to the cell label, it is trivial that all these neighbors are bombs.

```js
const isAMN = label(cell) === unmarkedNeighbours(cell);
```

# Glossary

1. Open cell: cell checked in a previous move.
2. Closed cell: unchecked cell.
3. Flagged cell: cell presumed to have a bomb.
4. Unflagged cell: closed cell of unknown content.
5. Frontier cell: opened cells with adjacent bombs. They are in the "frontier" between the board's open and closed parts.

# References

[Pedersen, K.. “The complexity of Minesweeper and strategies for game playing.” (2004).](https://www.semanticscholar.org/paper/The-complexity-of-Minesweeper-and-strategies-for-Pedersen/20833f71d74ff26ffd18979796cf1cbc8b3d92e6)

[Becerra, David J. 2015. Algorithmic Approaches to Playing Minesweeper. Bachelor's thesis, Harvard College.](http://nrs.harvard.edu/urn-3:HUL.InstRepos:14398552)

[Olshausen, Bruno A.. "Information Theory Primer." (2010).](https://redwood.berkeley.edu/courses/vs265-fall-2018/attachment/info-theory/)

https://github.com/ivory-it/ivoryit-testeestagio-campo-minado-js


[1]: https://www.semanticscholar.org/paper/The-complexity-of-Minesweeper-and-strategies-for-Pedersen/20833f71d74ff26ffd18979796cf1cbc8b3d92e6

[2]: http://nrs.harvard.edu/urn-3:HUL.InstRepos:14398552

[3]: https://redwood.berkeley.edu/courses/vs265-fall-2018/attachment/info-theory/  

# Trivia

Magawa: https://www.bbc.com/news/world-asia-57345703
