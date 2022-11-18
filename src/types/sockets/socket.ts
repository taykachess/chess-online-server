import type { Move } from "cm-chess";

export interface GetGame {
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
  pgn: string;
  result: "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+";
  inc: number;
  lastOfferDraw?: { username: string; ply: number };
}

export interface ServerToClientEvents {
  "challenge:created": (challenge: any) => void;
  "challenge:deleted": ({ socketId }: { socketId?: string }) => void;
  "game:started": ({ gameId }: { gameId?: string }) => void;
  "game:move": (move: string) => void;
  // prettier-ignore
  "game:end": ({result,newEloWhite,newEloBlack}: {result: "1-0" | "0.5-0.5" | "0-1" | "*" | "+-" | "-+"; newEloWhite:number; newEloBlack:number}) => void;
  // prettier-ignore
  "game:offerDraw": ({username, ply}: {username: string; ply: number;}) => void;
  "game:declineDraw": () => void;
}

export interface ClientToServerEvents {
  "challenge:subscribe": (cb: any) => void;
  "challenge:create": (challenge: any) => void;
  "challenge:cancel": () => void;
  "challenge:accept": ({ username }: { username: string }) => void;
  "game:move": ({ move, gameId }: { move: string; gameId: string }) => void;
  "game:resign": ({ gameId }: { gameId: string }) => void;
  "game:drawOffer": ({ gameId }: { gameId: string }) => void;
  "game:drawAccept": ({ gameId }: { gameId: string }) => void;
  "game:drawDecline": ({ gameId }: { gameId: string }) => void;

  "game:get": (
    { gameId }: { gameId: string },
    cb: (data: GetGame) => void
  ) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
  username: string;
}
