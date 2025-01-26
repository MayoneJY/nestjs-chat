import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:4000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { name } = useParams();
    const [chatroomId, setChatroomId] = useState('');

    useEffect(() => {
        // api call
        axios.get('http://localhost:4000/chatroom/' + name)
        .then((res) => {
            setChatroomId(res.data.chatroomId);
        })
        .catch((res) => {
            window.location.href = '/';
        })

        socket.on('sendMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.emit('joinRoom', {chatroomId: chatroomId, room: name, username: 'user'});
        const handleBeforeUnload = () => {
            socket.emit('leaveRoom', {chatroomId: chatroomId, room: name, username: 'user'})
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            socket.off('sendMessage');
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const sendMessage = () => {
        const message = {chatroomId: chatroomId, room: name, user: 'user', message: input};
        socket.emit('sendMessage', message);
        setInput('');
    };
    return (
        <div>
            <div>
                {messages.map((msg, idx) => (
                <div key={idx}>
                    <strong>{msg.user}:</strong> {msg.message}
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