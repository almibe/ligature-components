import express from "express";
import ViteExpress from "vite-express";
import * as zmq from "zeromq"

const app = express();

app.post("/wander", express.text({type: '*/*'}), async (req, res) => {
  const sock = new zmq.Request()
  sock.connect("tcp://127.0.0.1:4200");
  let script = await req.body;
  await sock.send(script);
  let [result] = await sock.receive();
  res.send(result);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
