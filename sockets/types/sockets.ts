import type { RemoteSocket, Server, Socket } from "socket.io";
import type { ChallengeFilters, GetChallenge } from "./challenge";
import type { MatchFilters } from "./match";
import type { GetGame, Result } from "./game";
import { GetMatch } from "./match";

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SocketRemoteType = RemoteSocket<ServerToClientEvents, SocketData>;

export interface ServerToClientEvents {
  "challenge:created": (challenge: GetChallenge) => void;
  "challenge:deleted": ({ socketId }: { socketId?: string }) => void;

  "match:created": (match: GetMatch) => void;
  "match:deleted": ({ socketId }: { socketId?: string }) => void;

  "game:started": ({ gameId }: { gameId?: string }) => void;
  "game:move": (move: string) => void;
  // prettier-ignore
  "game:end": ({result,newEloWhite,newEloBlack}: {result:Result; newEloWhite:number; newEloBlack:number}) => void;
  // prettier-ignore
  "game:offerDraw": ({username, ply}: {username: string; ply: number;}) => void;
  "game:declineDraw": () => void;
}

export interface ClientToServerEvents {
  "challenge:subscribe": (cb: any) => void;
  // prettier-ignore
  "challenge:create": ({ control, filters }: { control: string, filters: ChallengeFilters}) => void;
  "challenge:cancel": () => void;
  "challenge:accept": ({ username }: { username: string }) => void;

  "match:subscribe": (cb: any) => void;
  // prettier-ignore
  "match:create": ({ control, filters, rounds }: { control: string, filters: MatchFilters, rounds:number }) => void;
  "match:cancel": () => void;
  "match:accept": ({ username }: { username: string }) => void;

  "game:move": ({ move, gameId }: { move: string; gameId: string }) => void;
  "game:resign": ({ gameId }: { gameId: string }) => void;
  "game:drawOffer": ({ gameId }: { gameId: string }) => void;
  "game:drawAccept": ({ gameId }: { gameId: string }) => void;
  "game:drawDecline": ({ gameId }: { gameId: string }) => void;
  // prettier-ignore
  "game:get": ({ gameId }: { gameId: string },cb: (data: GetGame) => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
  username: string;
}
