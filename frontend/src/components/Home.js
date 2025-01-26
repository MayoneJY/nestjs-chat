import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [newRooms, setNewRooms] = useState([]);
    const [removeRooms, setRemoveRooms] = useState([]);

    const roomStyle = {
        position: 'relative',
        width: '400px',
        height: '80px',
        border: '1px solid black',
        cursor: 'pointer',
        // 가운데 정렬
        margin: '10px auto',
        borderRadius: '10px',
    };

    const removeButtonStyle = {
        position: 'absolute',
        right: '10px',
        top: '10px',
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
        <div>
            {rooms.map((room, idx) => (
                <div key={idx}
                    style={roomStyle} 
                    className={`${newRooms.includes(room) ? 'new-room' : ''} ${removeRooms.includes(room) ? 'leave-room' : ''}`} 
                    onClick={() => handleRoomClick(room)}>
                    <div style={{textAlign:"left", margin:"10px 0 0 10px"}}>{room}</div>
                    <input type="button" value="제거" onClick={(e) => handleRoomRemove(e)} style={removeButtonStyle}/>
                </div>
            ))}
            <input type="button" value="방 만들기" onClick={createRoom}/>
        </div>
    );
};

export default Home;