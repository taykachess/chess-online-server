import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [sveltekit()],
  ssr: { noExternal: ["cm-chessboard", "cm-chess", "gchessboard"] },
  server: {
    fs: { allow: ["sockets"] },
  },
};

export default config;
