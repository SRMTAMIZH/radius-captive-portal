const radius = require('radius');
const dgram = require('dgram');

// Define the RADIUS server address and shared secret
const RADIUS_SERVER = '103.255.234.130'; // Your RADIUS server IP
const RADIUS_SECRET = 'jazenetworks'; // Your RADIUS shared secret

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { username, password } = req.body;

    // Create a RADIUS request
    const packet = radius.encode_request(radius.ACCESS_REQUEST, {
        UserName: username,
        UserPassword: password,
    }, RADIUS_SECRET);

    const client = dgram.createSocket('udp4');

    client.send(packet, 0, packet.length, 1812, RADIUS_SERVER, (err) => {
        if (err) {
            return res.status(500).send('Error connecting to RADIUS server');
        }
    });

    client.on('message', (msg) => {
        const response = radius.decode_response(msg, RADIUS_SECRET);
        if (response.code === radius.ACCESS_ACCEPT) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid credentials');
        }
        client.close();
    });

    client.on('error', (err) => {
        res.status(500).send('RADIUS server not responding');
        client.close();
    });

    // Timeout after 3 seconds
    setTimeout(() => {
        client.close();
        res.status(500).send('RADIUS server did not respond in time');
    }, 3000);
}
