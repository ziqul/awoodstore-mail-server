const http = require("http");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "awoodstorebot@gmail.com",
		pass: process.env.PASS
	}
});

const requestListener = function (req, res) {
	console.log("[INFO] Received request: " + req.socket.remoteAddress + " " + req.method + " " + req.url);

	if (req.method === "POST") {
		let body = [];
		req.on("data", (chunk) => {
			body.push(chunk);
		}).on("end", () => {
			body = Buffer.concat(body).toString();

			var mailOptions = {
				from: "awoodstorebot@gmail.com",
				to: process.env.RCPT,
				subject: "Order at aWoodStore.com #" + crypto.randomBytes(16).toString("hex"),
				text: body
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log("[ERROR] " + error);
				} else {
					console.log("[INFO] Email sent: " + info.response);
				}
			});

			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Methods", "*");
			res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
			res.writeHead(200);
			res.end("OK");
		});
	} else {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "*");
		res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
		res.writeHead(200);
		res.end("OK");
	}

}

const server = http.createServer(requestListener);
server.listen(process.env.PORT, () => {
	console.log("[INFO] Listening on :" + process.env.PORT);
});
