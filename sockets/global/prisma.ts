import { PrismaClient } from '@prisma/client'
import { type TimePeriods as TypePeriodsType, TimePeriods, Player, MatchResults } from '../zod/schemas'
export const prisma = new PrismaClient().$extends({
  result: {
    match: {
      periodsData: {
        needs: { periods: true },
        compute({ periods }) {
          return periods as TypePeriodsType
        },
      },
      resultsData: {
        needs: { result: true },
        compute({ result }) {
          return result as MatchResults
        },
      },
    },
  },

  query: {
    match: {
      create({ args, query }) {
        console.log(args)
        args.data.periods = TimePeriods.parse(args.data.periods)
        return query(args)
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
})
