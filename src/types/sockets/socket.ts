import type { Move } from "cm-chess";

export interface GetGame {
  white: { username: string; rating: number };
  black: { username: string; rating: number };
  time: [number, number];
  pgn: string;
  result: string;
}

export interface ServerToClientEvents {
  "challenge:created": (challenge: any) => void;
  "challenge:deleted": ({ socketId }: { socketId?: string }) => void;
  "game:started": ({ gameId }: { gameId?: string }) => void;
  "game:move": (move: string) => void;
  "game:end": ({ result }: { result: string }) => void;
}

export interface ClientToServerEvents {
  "challenge:subscribe": (cb: any) => void;
  "challenge:create": (challenge: any) => void;
  "challenge:cancel": () => void;
  "challenge:accept": ({ username }: { username: string }) => void;
  "game:move": ({ move, gameId }: { move: string; gameId: string }) => void;

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
