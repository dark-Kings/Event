import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import gi from '../assets/giventures.png';
import nv from '../assets/nvidia-partner.png';

const HomeComponent = () => {
    // Sample data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    // State to track which row is in edit mode
    const [editRowId, setEditRowId] = useState(null);

    const getData = async () => {
        setLoading(true)
        const data = await fetch('http://localhost:8000/user/getData')
        const response = await data.json()
        console.log(response)
        setData(response.data)
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])
    // Handle checkbox changes
    const handleCheckboxChange = (id, field) => {
        setData(prevData =>
            prevData.map(item =>
                item.Id === id ? { ...item, [field]: item[field] === 0 ? 1 : 0 } : item
            )
        );
    };

    // Handle room number change
    const handleRoomNoChange = (id, newRoomNo) => {
        setData(prevData =>
            prevData.map(item =>
                item.Id === id ? { ...item, RoomNo: newRoomNo } : item
            )
        );
    };

    // Toggle edit mode and handle save
    const toggleEditMode = (id) => {
        if (editRowId === id) {
            // Save changes
            console.log('Updated Data:', data.find(item => item.Id === id)); // Log updated data
            alert(JSON.stringify(data.find(item => item.Id === id), null, 2)); // Display data in alert
            setEditRowId(null);
        } else {
            // Enter edit mode
            setEditRowId(id);
        }
    };

    return (
        !data ? <>loading</> : <>
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
                            <th>Guest ID</th>
                            <th>Name</th>
                            <th>Flight No</th>
                            <th>Boarded</th>
                            <th>Room No</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.IDDetId}>
                                <td>{index}</td>
                                <td>{item.GuestId}</td>
                                <td>{item.Name}</td>
                                <td>{item.FlightNo}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.Boarded === 1}
                                        onChange={() => handleCheckboxChange(index, 'Boarded')}
                                        disabled={editRowId !== index} // Disable if not in edit mode
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.RoomNo}
                                        onChange={(e) => handleRoomNoChange(index, e.target.value)}
                                        className="form-control"
                                        disabled={editRowId !== index} // Enable only if editing
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.CheckIn === 1}
                                        onChange={() => handleCheckboxChange(index, 'CheckIn')}
                                        disabled={editRowId !== index} // Disable if not in edit mode
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.CheckOut === 1}
                                        onChange={() => handleCheckboxChange(index, 'CheckOut')}
                                        disabled={editRowId !== index} // Disable if not in edit mode
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning ms-2"
                                        style={{
                                            backgroundColor: '#76B900', // Background color
                                            color: '#FFFFFF',            // Text color
                                        }}
                                        onClick={() => toggleEditMode(index)}
                                    >
                                        {editRowId === index ? 'Save' : 'Edit'}
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
