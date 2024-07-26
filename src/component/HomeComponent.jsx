import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import gi from '../assets/giventures.png';
import nv from '../assets/nvidia-partner.png';

const HomeComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState({});
    const [selectedFlightNo, setSelectedFlightNo] = useState('');

    const getData = async () => {
        setLoading(true);
        const response = await fetch('http://localhost:8000/user/getData');
        const result = await response.json();
        const groupedByFlightNo = result.data.reduce((result, item) => {
            if (!result[item.FlightNo]) {
                result[item.FlightNo] = [];
            }
            result[item.FlightNo].push(item);
            return result;
        }, {});
        setGroupedData(groupedByFlightNo);
        setData(result.data);
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const updateData = async (updatedItem) => {
        setLoading(true);
        const response = await fetch('http://localhost:8000/user/updateData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([updatedItem])
        });
        const result = await response.json();
        setLoading(false);
        if (result.success) {
            getData();
        }
    };

    const handleCheckboxChange = (id, field) => {
        const updatedData = data.map((item, index) =>
            index === id ? { ...item, [field]: item[field] === 0 ? 1 : 0 } : item
        );
        setData(updatedData);

        const updatedItem = updatedData.find((item, index) => index === id);
        const serverData = [{
            IDDetId: `${updatedItem["IDDetId"]}`,
            Field: field,
            FieldValue: `${updatedItem[field]}`
        }];
        updateData(serverData);
    };

    const handleRoomNoChange = (index, newRoomNo) => {
        const updatedData = data.map((item, idx) =>
            idx === index ? { ...item, RoomNo: newRoomNo } : item
        );
        setData(updatedData);
    };

    const handleRoomNoKeyPress = (index, event) => {
        if (event.key === 'Enter') {
            const updatedItem = data.find((item, idx) => idx === index);
            const serverData = [{
                IDDetId: `${updatedItem["IDDetId"]}`,
                Field: "RoomNo",
                FieldValue: `${updatedItem.RoomNo}`
            }];
            updateData(serverData);
        }
    };

    const handleFlightNoChange = (event) => {
        setSelectedFlightNo(event.target.value);
    };

    const filteredData = selectedFlightNo ? groupedData[selectedFlightNo] : data;

    return (
        loading ? <>loading</> : (
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
                    <div className="mb-3">
                        <label htmlFor="flightNoSelect" className="form-label">Select Flight No</label>
                        <select id="flightNoSelect" className="form-select" value={selectedFlightNo} onChange={handleFlightNoChange}>
                            <option value="">All</option>
                            {Object.keys(groupedData).map(flightNo => (
                                <option key={flightNo} value={flightNo}>{flightNo}</option>
                            ))}
                        </select>
                    </div>
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
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
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.RoomNo}
                                            onChange={(e) => handleRoomNoChange(index, e.target.value)}
                                            onKeyPress={(e) => handleRoomNoKeyPress(index, e)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.CheckIn === 1}
                                            onChange={() => handleCheckboxChange(index, 'CheckIn')}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.CheckOut === 1}
                                            onChange={() => handleCheckboxChange(index, 'CheckOut')}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </>
        )
    );
}

export default HomeComponent;
