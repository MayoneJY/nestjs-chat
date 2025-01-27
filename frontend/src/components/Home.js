import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:4000');

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [newRooms, setNewRooms] = useState([]);
    const [removeRooms, setRemoveRooms] = useState([]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };
      
    const roomStyle = {
        position: 'relative',
        width: '400px',
        minHeight: '80px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        margin: '12px auto',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
    };
    
    const roomHoverStyle = {
        transform: 'scale(1.02)',
    };
    
    const removeButtonStyle = {
        position: 'absolute',
        right: '10px',
        top: '10px',
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    };

    const createRoomButtonStyle = {
        margin: '16px 0',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    useEffect(() => {
        socket.on('sendRooms', (roomList) => {
            console.log(roomList);
            setRooms(roomList);
        });
        socket.on('createRoom', (room) => {
            setRooms((prev) => [room, ...prev]);
            setNewRooms((prev) => [...prev, room]);

            setTimeout(() => {
                // 0.5초 후 첫 번째 요소 제거
                setNewRooms((prev) => prev.slice(1));
            }, 500);
        });
        socket.on('removeRoom', (room) => {
            setRemoveRooms((prev) => [...prev, room]);

            setTimeout(() => {
                setRemoveRooms((prev) => prev.slice(1));
                setRooms((prev) => prev.filter((r) => r !== room));
            }, 500);
        });
        socket.on('errorRoom', (error) => {
            alert(error)
        });

        socket.emit('getRooms');
        return () => {
            socket.off('sendRooms');
            socket.off('createRoom');
            socket.off('removeRoom');
            socket.off('errorRoom');
        };
    }, []);
    const createRoom = () => {
        const room = prompt('방 이름을 적어주세요.');
        if (room) {
            socket.emit('createRoom', room);
        }
    }
    const handleRoomClick = (room) => {
        if (removeRooms.includes(room)) {
            return;
        }
        window.location.href = `/chat/${room}`;
    }
    const handleRoomRemove = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const room = e.target.parentNode.firstChild.innerText;
        socket.emit('deleteRoom', room);
    }
    return (
        <div style={containerStyle}>
            {rooms.map((room, idx) => {
            const isNewRoom = newRooms.includes(room);
            const isRemovedRoom = removeRooms.includes(room);
            return (
                <div
                    key={idx}
                    style={roomStyle}
                    className={`${isNewRoom ? 'new-room' : ''} ${isRemovedRoom ? 'leave-room' : ''}`}
                    onMouseEnter={e => e.currentTarget.style.transform = roomHoverStyle.transform}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    onClick={() => handleRoomClick(room)}>
                    <div style={{ textAlign: 'left', margin: '10px 0 0 10px', fontWeight: 'bold' }}>{room}</div>
                    <button
                        onClick={(e) => handleRoomRemove(e)}
                        style={removeButtonStyle}>
                        제거
                    </button>
                </div>
            );
            })}
            <button
                onClick={createRoom}
                style={createRoomButtonStyle}>
                방 만들기
            </button>
        </div>
    );
};

export default Home;