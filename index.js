const express = require("express");
const app = express();
const http = require("https");

app.get("/", async (req, res) => {
  /* const { eventMessage } = JSON.parse(event.body); */
  const eventMessage = "Hello from the controllino!";
  const options = {
    method: "POST",
    hostname: "messages-sandbox.nexmo.com",
    port: null,
    path: "/v1/messages",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic NjRjNTljYjc6eFZSd1BhcW94ajhrb2pNRA==",
    },
  };

  const request = async (number, message) => {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Status Code: ${res.statusCode}`));
        }

        const chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => resolve(Buffer.concat(chunks).toString()));
      });

      req.on("error", reject);

      req.write(
        JSON.stringify({
          from: "14157386102",
          to: number,
          message_type: "text",
          text: message,
          channel: "whatsapp",
        })
      );
      req.end();
    });
  };

  try {
    const numbers = [
      "18683341507", //SR
      "18683473920", //BG
      "18687701084", //DR
      "18683248261", //ST
      "18683505059", //CP
      "18687439498", // JB
      "18683220168", //AO
      "18682916851", // KM
    ];

    for (const number of numbers) {
      console.log(number);
      console.log(eventMessage);
      const data = await request(number, eventMessage);
      console.log(data);
    }
    /*
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "ok" }), 
    };
    */
    return res.send("Hello World!");
  } catch (error) {
    console.error(error);
    return res.send({
        statusCode: 400, 
        error,
    })
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
