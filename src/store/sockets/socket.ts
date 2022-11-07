import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "$types/sockets/socket";
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { listOfChallenges } from "$store/home/challenges";

export const socket: Writable<
  Socket<ServerToClientEvents, ClientToServerEvents>
> = writable(
  browser
    ? io("http://localhost:3000", {
        auth: { token: localStorage.getItem("token") },
      })
    : undefined
);

export const deleteSocketListenersHome = () => {
  socket.subscribe((value) => value.removeListener());
};

export const subscribeOnGettingChallenges = () => {
  socket.subscribe((value) =>
    value.emit("challenge:subscribe", (challenges: any) => {
      console.log(challenges);
    })
  );

  socket.subscribe((value) =>
    value.on("challenge:created", (challenge: any) => {
      let unsubscribe = listOfChallenges.subscribe((val) => {
        val.challenges?.push(challenge);
        val.count = val.count + 1;
      });

      unsubscribe();
      unsubscribe = listOfChallenges.subscribe((val) => {
        val.challenges = val.challenges;
        console.log("val", val);
      });
      unsubscribe();

      // listOfChallenges.update(({challenges}) => );
      console.log("Got challenge", challenge);
    })
  );
};

export const emitCreateChallenge = (data: any) => {
  socket.subscribe((val) => val.emit("challenge:create", data));
};

export const connectSocket = () => {
  socket.subscribe((value) =>
    value.on("connect", () => {
      console.log("I connected");
    })
  );
};
