import { PrismaClient } from "@prisma/client";
import {
  type TimePeriods as TypePeriodsType,
  TimePeriods,
  Player,
  MatchResult,
} from "../zod/schemas";
export const prisma = new PrismaClient().$extends({
  result: {
    match: {
      periodsData: {
        needs: { periods: true },
        compute({ periods }) {
          return periods as TypePeriodsType;
        },
      },
    },
    gameData: {
      white: {
        needs: { white: true },
        compute({ white }) {
          return white as Player;
        },
      },
      blackData: {
        needs: { black: true },
        compute({ black }) {
          return black as Player;
        },
      },
    },
  },

  query: {
    match: {
      create({ args, query }) {
        console.log(args);
        args.data.periods = TimePeriods.parse(args.data.periods);
        return query(args);
      },
      // update({ args, query }) {
      //   args.data.result = MatchResult.parse(args.data.periods);
      //   return query(args);
      // },
    },
    // game:{
    //     create({args, query}) {
    //         args.data.white = Player
    //     }
    // }
  },
});
