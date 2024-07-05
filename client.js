import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import io from 'socket.io-client';
import ss from 'socket.io-stream';

const socket = io('http://localhost:5000');

function SocketIOApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const textChunkHandler = (msg) => {
    const parsedData = JSON.parse(msg);

    console.log({ parsedData });

    if (parsedData.initial) {
      setMessages((prevState) => [...prevState, parsedData]);
      return;
    }

    setMessages((prevState) =>
      prevState.map((state) => {
        if (state.messageId === parsedData.messageId) {
          return {
            ...state,
            text: `${state.text} ${parsedData.text}`,
          };
        }

        return state;
      })
    );
  };

  useEffect(() => {
    const textStreamHandler = (stream) => {
      stream.on('data', (chunk) => {
        textChunkHandler(chunk);
      });

      stream.on('end', () => {
        console.log('STREAM ENDED');
      });
    };

    ss(socket).on('text-stream', textStreamHandler);

    // socket.on('message-response', (msg) => {
    //   textChunkHandler(msg);
    // });

    socket.on('stream-error', (errorMsg) => {
      console.log('STREAM ERROR ', errorMsg);
    });

    socket.onAny((event, ...args) => {
      // eslint-disable-next-line no-console
      console.log({ event, args });
    });

    return () => {
      socket.off('message');
      socket.off('text-stream', textStreamHandler);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const messageObj = {
        text: input,
        messageId: 111,
      };

      setMessages((prevMessages) => [...prevMessages, messageObj]);

      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <div className="App">
      <ul id="messages">
        {messages.map((msg) => (
          <li key={msg.id}>
            <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
          </li>
        ))}
      </ul>

      <form id="form" onSubmit={sendMessage}>
        <input
          id="m"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default SocketIOApp;
