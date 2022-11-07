export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "challenge:created": (challenge: any) => void;
}

export interface ClientToServerEvents {
  "challenge:subscribe": (cb: any) => void;
  "challenge:create": (challenge: any) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: string;
  username: string;
}
