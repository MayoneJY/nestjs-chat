import React from 'react';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:4000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { name } = useParams();
    const [chatroomId, setChatroomId] = useState('');

    const chatRef = useRef();

    const chatStyle = {
        width: '400px',
        height: '500px',
        border: '1px solid black',
        // 가운데 정렬
        margin: '10px auto',
        borderRadius: '10px',
        textAlign: 'left',
        padding: '10px',
        overflowY: 'scroll',
    };

    useEffect(async () => {
        let chatroomIdTemp = '';
        // api call
        await axios.get('http://localhost:4000/chatroom/' + name)
        .then((res) => {
            chatroomIdTemp = res.data.chatroomId;
            setChatroomId(res.data.chatroomId);
        })
        .catch((res) => {
            window.location.href = '/';
            return;
        })
        
        await axios.get(`http://localhost:4000/chat?chatroomId=${chatroomIdTemp}&page=1`)
        .then((res) => {
            setMessages(res.data);
        })

        socket.on('sendMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.emit('joinRoom', {chatroomId: chatroomIdTemp, room: name, user: 'user'});
        const handleBeforeUnload = () => {
            socket.emit('leaveRoom', {chatroomId: chatroomIdTemp, room: name, user: 'user'})
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        setTimeout(() => chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);
        return () => {
            socket.off('sendMessage');
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const sendMessage = () => {
        const message = {chatroomId: chatroomId, room: name, user: 'user', message: input};
        socket.emit('sendMessage', message);
        setInput('');
        // 스크롤 내림
        setTimeout(() => chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);
        
    };
    return (
        <div>
            <div style={chatStyle} ref={chatRef}>
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
                style={{width: '350px'}}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;