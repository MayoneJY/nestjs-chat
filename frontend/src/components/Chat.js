import React, { use } from 'react';
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
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [scrollLength, setScrollLength] = useState(0);
    const [nickname, setNickname] = useState('');

    const chatRef = useRef();

    const chatStyle = {
        width: '400px',
        height: '500px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc',
        margin: '20px auto',
        borderRadius: '12px',
        textAlign: 'left',
        padding: '12px',
        overflowY: 'scroll',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      };
      
    const messageBubbleStyle = {
        margin: '8px 0',
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    };

    useEffect(() => {
        if (loading || isEnd || !scroll) return;
        // 채팅 내역이 요소 크기 보다 작을 때
        if(chatRef.current.scrollHeight < 400) return;
        setLoading(true);
        setPage((prev) => prev + 1);
        console.log(chatroomId, page + 1);
        axios.get(`http://localhost:4000/chat?chatroomId=${chatroomId}&page=${page + 1}`)
        .then((res) => {
            if (res.data.length < 50) setIsEnd(true);
            setScrollLength(res.data.length);
            console.log(res.data.length);
            setMessages((prev) => [...res.data, ...prev]);
        })
        .catch((res) => {
            alert('error');
        });

        
        // 스크롤

        

        setLoading(false);
        setScroll(false);
        
    }, [scroll]);

    useEffect(() => {
        if (scrollLength === 0) return;
        chatRef.current.scrollTo({ top: chatRef.current.querySelector(`[data-key="${scrollLength}"]`).offsetTop, behavior: "auto" });

        setScrollLength(0);

    }, [scrollLength]);

    // 스크롤 이벤트 처리
    const handleScroll = () => {
        if (chatRef.current.scrollTop === 0) {
            setScroll(true);
        }
    };

    useEffect(async () => {
        const nicknameTemp = localStorage.getItem('nickname');
        setNickname(nicknameTemp);
        let chatroomIdTemp = '';
        // api call
        await axios.get('http://localhost:4000/chatroom/' + name)
        .then((res) => {
            chatroomIdTemp = res.data.chatroomId;
            setChatroomId(chatroomIdTemp);
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

        socket.emit('joinRoom', {chatroomId: chatroomIdTemp, room: name, user: nicknameTemp});
        const handleBeforeUnload = () => {
            socket.emit('leaveRoom', {chatroomId: chatroomIdTemp, room: name, user: nicknameTemp})
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        const scrollContainer = chatRef.current;
        scrollContainer.addEventListener("scroll", handleScroll);


        setTimeout(() => chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);
        return () => {
            socket.off('sendMessage');
            window.removeEventListener("beforeunload", handleBeforeUnload);
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const sendMessage = () => {
        const message = {chatroomId: chatroomId, room: name, user: nickname, message: input};
        socket.emit('sendMessage', message);
        setInput('');
        // 스크롤 내림
        setTimeout(() => chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 100);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={chatStyle} ref={chatRef}>
            {messages.map((msg, idx) => (
                <div key={idx} data-key={idx} style={messageBubbleStyle}>
                <strong>{msg.user}:</strong> {msg.message}
                </div>
            ))}
            </div>

            <div style={{ marginTop: '12px' }}>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                width: '300px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginRight: '8px',
                outline: 'none',
                }}
            />
            <button
                onClick={sendMessage}
                style={{
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                보내기
            </button>
            </div>
        </div>
    );
};

export default Chat;