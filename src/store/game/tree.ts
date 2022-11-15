import { writable, type Writable } from "svelte/store";

interface Node {
  san: string;
  ply: number;
  fen: string;
  variations?: Node[];
  previous: Node | undefined;
  next: Node | undefined;
  // color:'w'|'b';
}
// {
//     san: move?.san||'',
//     ply: $treeWrapper.currentNode.ply + 1,
//     fen,
//     variations: [],
//     previous: $treeWrapper.currentNode,
//     next: undefined,
//     from: move?.from,
//     to: move?.to,
//     color: $game.turn == 'w' ? 'b' : 'w',
//     piece: move?.piece
// };
export const tree: Writable<{
  history: Node[];
  currentNode: Node;
  liveNode: Node;
}> = writable();
