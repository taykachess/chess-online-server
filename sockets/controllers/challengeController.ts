import { SocketType } from '../types/sockets'
import { onChallengeCreate } from '../providers/challenge/onChallengeCreate'
import { onChallengeSub } from '../providers/challenge/onChallengeSub'
import { onChallengeDelete } from '../providers/challenge/onChallengeDelete'
import { onChallengeAccept } from '../providers/challenge/onChallengeAccept'

export function challengeController(socket: SocketType) {
  try {
    socket.on('challenge:subscribe', onChallengeSub)

    // Auth only
    if (!socket.data?.username) return
    socket.on('challenge:create', onChallengeCreate)
    socket.on('challenge:cancel', onChallengeDelete)
    socket.on('challenge:accept', onChallengeAccept)

    // Only for room challenges
  } catch (error) {
    // console.log(error);
  }
}
