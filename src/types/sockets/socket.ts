export interface ServerToClientEvents {
  "challenge:created": (challenge: any) => void;
  "challenge:deleted": ({ socketId }: { socketId?: string }) => void;
}

export interface ClientToServerEvents {
  "challenge:subscribe": (cb: any) => void;
  "challenge:create": (challenge: any) => void;
  "challenge:cancel": () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: number;
  username: string;
}
