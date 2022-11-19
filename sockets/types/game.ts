import type { ChessInstance } from "cm-chess";
import { Chess } from "chess.js";

export type Title = "GM" | "IM";
export interface Player {
  username: string;
  rating: number;
  ratingNext?: number;
  title?: Title | null;
}

export type Result = "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+";

type OfferedDrawPlayer = { username: string; ply: number; status?: "declined" };

export interface Game {
  time: [w: number, b: number];
  white: Player;
  black: Player;
  // Needed for inside memory use
  chess: Chess;
  // Needed for inside memory use
  timerId: any;
  ply: number;
  tsmp: number;
  increment: number;
  result: Result;
  control: string;
  lastOfferDraw?: OfferedDrawPlayer;
}
export interface Games {
  [id: string]: Game;
}

// Frontend and Backend
export interface GetGame {
  white: Player;
  black: Player;
  time: [number, number];
  pgn: string;
  result: Result;
  inc: number;
  lastOfferDraw?: OfferedDrawPlayer;
}

interface Node {
  san: string;
  ply: number;
  fen: string;
  variations?: Node[];
  previous: Node | undefined;
  next: Node | undefined;
}

export interface GameInfo {
  white: Player;
  black: Player;
  time: [number, number];
  result: Result;
  pgn: string;
  requestId?: any;
  inc: number;
  lastOfferDraw?: OfferedDrawPlayer;
  ply: number;
  role?: "w" | "b";
  tree: {
    history: Node[];
    currentNode: Node;
    liveNode: Node;
  };
  chess: ChessInstance;
}
