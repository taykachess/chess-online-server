/* eslint-disable @typescript-eslint/ban-ts-comment */
import { io, app } from './global/io'
import { verify } from 'jsonwebtoken'

import * as dotenv from 'dotenv'
import { challengeController } from './controllers/challengeController'
import { onDisconnect } from './providers/base/onDisconnect'
import { gameController } from './controllers/gameController'
import { matchController } from './controllers/matchController'
import { tournamentController } from './controllers/tournamentController'
import { pubClient, subClient } from './global/redis'
import { createAdapter } from '@socket.io/redis-adapter'
import { startTournament } from './services/tournament/startTournament'
import { prisma } from './global/prisma'
import { USER_ROOM } from './variables/redisIndex'

dotenv.config({ path: '../.env' })
// let counter = 1;
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) next()
  if (token) {
    // @ts-ignore
    verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // @ts-ignore
      socket.data.username = decoded?.username
      next()
    })
  }
})

io.on('connection', async (socket) => {
  if (socket.data.username) socket.join(USER_ROOM(socket.data.username))

  // console.log(socket.id, "connected!");

  challengeController(socket)
  gameController(socket)
  matchController(socket)
  tournamentController(socket)

  // socket.on("ping", (cb: any) => {
  //   console.log("pong", counter++);
  //   cb("pong");
  // });

  socket.on('disconnect', onDisconnect)
})

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient))

  app.listen(3000, (token: any) => {
    console.log('Server is connected')
    if (!token) {
      console.warn('port already in use')
    }
  })
})

// prisma.tournament
//   .update({
//     where: {
//       id: "clav5lj9q0000p13dg45de9ix",
//     },
//     data: {
//       status: "registration",
//       control: "0.2+0",
//       startTime: new Date(new Date().getTime() + 1000 * 60 * 0.1),
//     },
//   })
//   .then((tournament) => {
//     const diff = tournament.startTime.getTime() - new Date().getTime();

//     setTimeout(async () => {
//       await startTournament("clav5lj9q0000p13dg45de9ix");
//     }, diff);
//   });
