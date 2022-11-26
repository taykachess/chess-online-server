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
  matchId?: string;
  tournamentId?: string;
  round?: number;
  board?: number;
}

export interface Games {
  [id: string]: Game;
}

// Frontend and Backend
// prettier-ignore
export interface GetGame extends Pick<Game, "white"| "black"|"time"|"result"|"increment"|"lastOfferDraw"|"matchId"> {
  pgn: string;
}

interface Node {
  san: string;
  ply: number;
  fen: string;
  variations?: Node[];
  previous: Node | undefined;
  next: Node | undefined;
}

// prettier-ignore
export interface GameInfo extends Pick<GetGame, "white"| "black"|"time"|"result"|"pgn"|"increment"|"lastOfferDraw"|"matchId"> {
  requestId?: any;
  ply: number;
  role?: "w" | "b";
  tree: {
    history: Node[];
    currentNode: Node;
    liveNode: Node;
  };
  chess: ChessInstance;
}
