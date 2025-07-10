import { createApp } from "vinxi";
import { config } from "vinxi/plugins/config";

export default createApp({
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public",
    },
    {
      name: "client",
      type: "spa",
      handler: "./index.html",
      base: "/",
      plugins: () => [
        config("custom", {
          // additional vite options
        }),
        // additional vite plugins
      ],
    },
  ],
});