const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ss = require('socket.io-stream');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    // API call to event streaming server.....
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/events',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      // STREAM FORWARDING THROUGH socket.io-stream..............
      const stream = ss.createStream();
      ss(socket).emit('text-stream', stream);

      res.on('data', (chunk) => {
        try {
          let msgChunk = chunk.toString().trim();
          msgChunk = msgChunk.substring(21);

          // STREAM FORWARDING THROUGH EVENTS...........................
          // socket.emit('message-response', msgChunk);

          // STREAM FORWARDING THROUGH socket.io-stream..................
          stream.write(msgChunk);

          const parsedMsgChunk = JSON.parse(msgChunk);

          if (parsedMsgChunk.final) {
            stream.end();
          }
        } catch (error) {
          console.error('Stream write error:', error);
          stream.end();
          socket.emit('stream-error', {
            message: 'Error during streaming text data.',
          });
        }
      });

      // Handle stream errors
      stream.on('error', (err) => {
        console.error('Stream error:', err);
      });

      res.on('end', () => {
        console.log('Message end========');
      });
    });

    req.on('error', (e) => {
      console.error(`request error: ${e.message}`);
    });

    req.end();
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send(`Server ${PORT} is ONLINE`);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
