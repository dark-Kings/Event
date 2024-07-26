import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import gi from '../assets/giventures.png';
import nv from '../assets/nvidia-partner.png';

const HomeComponent = () => {
    // Sample data
    const [data, setData] = useState([
        { id: 1, guestId: 'G123', name: 'John Doe', flightNo: 'FL123', boarded: false, roomNo: '101', checkIn: false, checkOut: false },
        { id: 2, guestId: 'G124', name: 'Jane Smith', flightNo: 'FL124', boarded: true, roomNo: '102', checkIn: true, checkOut: false },
        { id: 3, guestId: 'G125', name: 'Sam Brown', flightNo: 'FL125', boarded: false, roomNo: '103', checkIn: false, checkOut: true }
    ]);

    // State to track which row is in edit mode
    const [editRowId, setEditRowId] = useState(null);

    // Handle checkbox changes
    const handleCheckboxChange = (id, field) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, [field]: !item[field] } : item
            )
        );
    };

    // Handle room number change
    const handleRoomNoChange = (id, newRoomNo) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, roomNo: newRoomNo } : item
            )
        );
    };

    // Toggle edit mode and handle save
    const toggleEditMode = (id) => {
        if (editRowId === id) {
            // Save changes
            console.log('Updated Data:', data.find(item => item.id === id)); // Log updated data
            alert(JSON.stringify(data.find(item => item.id === id), null, 2)); // Display data in alert
            setEditRowId(null);
        } else {
            // Enter edit mode
            setEditRowId(id);
        }
    };

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img src={nv} alt="NVIDIA" style={{ width: '120px', height: 'auto' }} />
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                            aria-controls="navbarCollapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <a className="navbar-brand" href="#">
                            <img src={gi} alt="Giventures" style={{ width: '120px', height: 'auto' }} />
                        </a>
                    </div>
                </nav>
            </header>
            <main className="container mt-4">
                <h2>Guest Information Table</h2>
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>GuestID</th>
                            <th>Name</th>
                            <th>FlightNo</th>
                            <th>Boarded</th>
                            <th>Room No</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.guestId}</td>
                                <td>{item.name}</td>
                                <td>{item.flightNo}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.boarded}
                                        onChange={() => handleCheckboxChange(item.id, 'boarded')}
                                        disabled={editRowId !== item.id} // Disable if not in edit mode
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.roomNo}
                                        onChange={(e) => handleRoomNoChange(item.id, e.target.value)}
                                        className="form-control"
                                        disabled={editRowId !== item.id} // Enable only if editing
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.checkIn}
                                        onChange={() => handleCheckboxChange(item.id, 'checkIn')}
                                        disabled={editRowId !== item.id} // Disable if not in edit mode
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.checkOut}
                                        onChange={() => handleCheckboxChange(item.id, 'checkOut')}
                                        disabled={editRowId !== item.id} // Disable if not in edit mode
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning ms-2"
                                        style={{
                                            backgroundColor: '#76B900', // Background color
                                            color: '#FFFFFF',            // Text color
                                        }}
                                        onClick={() => toggleEditMode(item.id)}
                                    >
                                        {editRowId === item.id ? 'Save' : 'Edit'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}

export default HomeComponent;
