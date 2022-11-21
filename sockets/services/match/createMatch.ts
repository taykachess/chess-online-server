import { Chess } from "chess.js";
import { v4 as uuid } from "uuid";

import { deleteGame, setGame } from "../../global/games";

import { PLAYERINGAME, TIME_TO_CANCEL_GAME } from "../../variables/redisIndex";

import type { Player } from "../../types/game";
import type { SocketRemoteType, SocketType } from "../../types/sockets";
import { redis } from "../../global/redis";
import { setMatch } from "../../global/matches";
import { Match } from "../../types/match";
import { createGame } from "../game/createGame";

export async function createMatch({
  sockets,
  createMatchDto,
}: {
  sockets: [socket1: SocketType, socket2: SocketRemoteType];
  createMatchDto: {
    white: Player;
    black: Player;
    control: string;
    rounds: number;
    armageddon: boolean;
  };
}) {
  if (!sockets[0].data?.username || !sockets[1].data?.username)
    throw Error("User can't be found");

  const matchId = uuid();
  //   player1: string;
  //   player2: string;
  //   rounds: number;
  //   result: { white: string; black: string; result: Result; gameId: string }[];
  //   armageddon: boolean;
  const match: Match = {
    player1: createMatchDto.white.username,
    player2: createMatchDto.black.username,
    rounds: createMatchDto.rounds,
    games: [],
    armageddon: createMatchDto.armageddon,
    result: [0, 0, 0],
    status: "running",
    control: createMatchDto.control,
  };
  setMatch(matchId, match);

  await createGame({
    sockets,
    data: {
      white: createMatchDto.white,
      black: createMatchDto.black,
      control: createMatchDto.control,
      matchId: matchId,
    },
  });
}
