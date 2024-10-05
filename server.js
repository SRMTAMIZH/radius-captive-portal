// server.js
const express = require('express');
const bodyParser = require('body-parser');
const radius = require('radius');
const dgram = require('dgram');

const app = express();
const PORT = process.env.PORT || 3000;
const RADIUS_SERVER = '103.255.234.130'; // Replace with your RADIUS server IP
const RADIUS_SECRET = 'jazenetworks'; // Replace with your RADIUS shared secret

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve your HTML files from a 'public' directory

app.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Create a RADIUS request
    const packet = radius.encode_request(radius.ACCESS_REQUEST, {
        UserName: username,
        UserPassword: password,
    }, RADIUS_SECRET);

    // Send the request to the RADIUS server
    const client = dgram.createSocket('udp4');
    client.send(packet, 0, packet.length, 1812, RADIUS_SERVER, (err) => {
        if (err) {
            return res.status(500).send('Error connecting to RADIUS server');
        }
    });

    // Listen for response
    client.on('message', (msg) => {
        const response = radius.decode_response(msg, RADIUS_SECRET);
        if (response.code === radius.ACCESS_ACCEPT) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid credentials');
        }
        client.close();
    });

    // Handle timeout
    client.on('error', (err) => {
        res.status(500).send('RADIUS server not responding');
        client.close();
    });

    // Timeout after 3 seconds
    setTimeout(() => {
        client.close();
        res.status(500).send('RADIUS server did not respond in time');
    }, 3000);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

