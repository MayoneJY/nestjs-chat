import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { name } = useParams();

    useEffect(() => {
        socket.on('sendMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.emit('joinRoom', {room: name, username: 'user'});
        const handleBeforeUnload = () => {
            socket.emit('leaveRoom', {room: name, username: 'user'})
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            socket.off('sendMessage');
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const sendMessage = () => {
        const message = {room: name, username: 'user', content: input};
        socket.emit('sendMessage', message);
        setInput('');
    };
    return (
        <div>
            <div>
                {messages.map((msg, idx) => (
                <div key={idx}>
                    <strong>{msg.username}:</strong> {msg.content}
                </div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;