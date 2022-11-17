import { writable, type Writable } from "svelte/store";
import type { ChessInstance } from "cm-chess";
// import type { ChessBoardInstance } from "cm-chessboard-ts";

interface Node {
  san: string;
  ply: number;
  fen: string;
  variations?: Node[];
  previous: Node | undefined;
  next: Node | undefined;
}

interface GameInfo {
  white: {
    username: string;
    rating: number;
    ratingNext?: number;
    title?: string;
  };
  black: {
    username: string;
    rating: number;
    ratingNext?: number;
    title?: string;
  };
  time: [number, number];
  result: "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+";
  pgn: string;
  requestId?: any;
  inc: number;
  lastOfferDraw?: { username: string; ply: number };
  ply: number;
  role?: "w" | "b";
  tree: {
    history: Node[];
    currentNode: Node;
    liveNode: Node;
  };
  chess: ChessInstance;
}
export const info: Writable<GameInfo> = writable();
