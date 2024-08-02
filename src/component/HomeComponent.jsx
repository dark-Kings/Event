import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import nv from './nvidia-partner.png';
import imageStrip from './unnamed.jpg';
import { useLocation } from 'react-router-dom';
import './HomeComponent.css';
import user from './User.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState({});
    const [selectedFlightNo, setSelectedFlightNo] = useState('');
    const [selectedBoardingStatus, setSelectedBoardingStatus] = useState('');
    const location = useLocation();
    const { username } = location.state || {};

    const BASE_URL = import.meta.env.VITE_API_URL;

    const getData = () => {
        setLoading(true);
        fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{}]),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(e => {
                try {
                    return JSON.parse(e);
                } catch {
                    throw new Error('Failed to parse JSON');
                }
            })
            .then(result => {
                if (Array.isArray(result) && result.every(item => item.FlightNo)) {
                    const groupedByFlightNo = result.reduce((acc, item) => {
                        if (!acc[item.FlightNo]) {
                            acc[item.FlightNo] = [];
                        }
                        acc[item.FlightNo].push(item);
                        return acc;
                    }, {});
                    setGroupedData(groupedByFlightNo);
                    setData(result);
                } else {
                    throw new Error('Unexpected response format');
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    const updateData = (updatedItem, message) => {
        setLoading(true);
        fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result) {
                    toast(message, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    throw new Error('Failed to update data');
                }
            })
            .catch(error => {
                console.error('Error updating data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCheckboxChange = (id, field) => {
        const updatedData = data.map((item) =>
            item.IDDetID === id ? { ...item, [field]: item[field] === 0 ? 1 : 0 } : item
        );
        setData(updatedData);

        const updatedGroupedData = { ...groupedData };
        Object.keys(updatedGroupedData).forEach(flightNo => {
            updatedGroupedData[flightNo] = updatedGroupedData[flightNo].map(item =>
                item.IDDetID === id ? { ...item, [field]: item[field] === 0 ? 1 : 0 } : item
            );
        });
        setGroupedData(updatedGroupedData);

        const updatedItem = updatedData.find((item) => item.IDDetID === id);
        const serverData = [{
            IDDetID: `${updatedItem["IDDetID"]}`,
            FieldName: field,
            FieldValue: `${updatedItem[field]}`
        }];
        const message = field === 'Boarded' ? `ID: ${updatedItem["GuestId"]} Boarded` : field === 'CheckIN' ? `ID: ${updatedItem["GuestId"]} Check-In Completed` : field === 'CheckOut' ? `ID: ${updatedItem["GuestId"]} Check-Out Completed` : `ID: ${updatedItem["GuestId"]} Gifted`;
        updateData(serverData, message);
    };

    const handleRoomNoChange = (id, newRoomNo) => {
        const sanitizedRoomNo = newRoomNo.trim(); // Sanitize input
        const updatedData = data.map((item) =>
            item.IDDetID === id ? { ...item, RoomNo: sanitizedRoomNo } : item
        );
        setData(updatedData);

        const updatedGroupedData = { ...groupedData };
        Object.keys(updatedGroupedData).forEach(flightNo => {
            updatedGroupedData[flightNo] = updatedGroupedData[flightNo].map(item =>
                item.IDDetID === id ? { ...item, RoomNo: sanitizedRoomNo } : item
            );
        });
        setGroupedData(updatedGroupedData);
    };

    const handleRoomNoBlur = (id) => {
        const updatedItem = data.find((item) => item.IDDetID === id);
        const serverData = [{
            IDDetID: `${updatedItem.IDDetID}`,
            FieldName: "RoomNo",
            FieldValue: `${updatedItem.RoomNo}`
        }];
        const message = `ID: ${updatedItem["GuestId"]} Room Updated`;
        updateData(serverData, message);
    };

    const handleFlightNoChange = (event) => {
        setSelectedFlightNo(event.target.value);
    };

    const handleBoardingStatusChange = (event) => {
        setSelectedBoardingStatus(event.target.value);
    };

    const filteredData = data
        .filter(item => selectedFlightNo === 'All' || item.FlightNo === selectedFlightNo)
        .filter(item => {
            if (selectedBoardingStatus === '') return true;
            return selectedBoardingStatus === 'Boarded' ? item.Boarded === 1 : item.Boarded === 0;
        });

    const getImageSrc = (base64String) => {
        try {
            if (base64String.startsWith("data:")) {
                return base64String;
            } else {
                const mimeType = "image/jpeg";
                return `data:${mimeType};base64,${base64String}`;
            }
        } catch (error) {
            console.log(error);
            return base64String;
        }
    };

    const summaryData = Object.keys(groupedData).map((flightNo, index) => {
        const totalBoarded = groupedData[flightNo].filter(item => item.Boarded === 1).length;
        const totalNotBoarded = groupedData[flightNo].length - totalBoarded;
        return {
            id: index + 1,
            flightNo,
            boarded: totalBoarded,
            notBoarded: totalNotBoarded
        };
    });
    const totalCheckIn = data.filter(item => item.CheckIN === 1).length;
    const totalCheckOut = data.filter(item => item.CheckOut === 1).length;
    const totalGotHotel = data.filter(item => item.RoomNo).length;
    const totalNotGotHotel = data.length - totalGotHotel;
    const gifted = data.filter(item => item.Gift === 1).length;
    const notGifted = data.filter(item => item.Gift === 0).length;

    // Calculate the total unique room count
    const roomNumbers = data.map(item => item.RoomNo.trim().replace(/\s+/g, '')); // Trim and replace multiple spaces with a single space
    const uniqueRoomNumbers = new Set(roomNumbers);
    const totalRoom = uniqueRoomNumbers.size - 1;

    return (
        <>
            <ToastContainer />
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <div className="container-fluid d-flex align-items-center justify-content-between">
                        <img src={nv} alt="NVIDIA" className="navbar-brand" style={{ width: '120px', height: 'auto' }} />
                        <h3 className="text-white m-0 me-3 navbar-brand">Hello {username}</h3>
                    </div>
                </nav>
            </header>
            <main className="container-lg mt-1">
                <img src={imageStrip} alt="Image Strip" className="img-fluid" />
                <div className='d-flex justify-content-around align-items-center custom-style' style={{ width: '100%' }}>
                    <div className='table-responsive custom-table ' >
                        <table className="table table-striped mt-4 " style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th className='text-nowrap'>ID</th>
                                    <th className='text-nowrap'>Flight No</th>
                                    <th className='text-nowrap'>Boarded</th>
                                    <th className='text-nowrap'>Not Boarded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.flightNo}</td>
                                        <td>{item.boarded}</td>
                                        <td>{item.notBoarded}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 d-flex justify-content-around w-100 custom-cardStyle" style={{ marginLeft: '10px' }}>
                        <div className='d-flex justify-content-around w-100 custom-summarry'>
                            <div>
                                <p><strong>Check-ins &nbsp;&nbsp;&nbsp;:</strong> <strong>{totalCheckIn}</strong></p>
                                <p><strong>Check-outs&nbsp;:</strong> <strong>{totalCheckOut}</strong></p>
                            </div>
                            <div>
                                <p><strong>Hotel Allotted&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> <strong>{totalGotHotel}</strong></p>
                                <p><strong>Hotel Unallotted&nbsp;:</strong> <strong>{totalNotGotHotel}</strong></p>
                            </div>
                        </div>
                        <div className='d-flex justify-content-around w-100 custom-summarry'>
                            <div>
                                <p><strong>Gifted&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> <strong>{gifted}</strong></p>
                                <p><strong>Notgifted&nbsp;:</strong> <strong>{notGifted}</strong></p>
                            </div>
                            <div>
                                <p><strong>Room Allotted&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> <strong>{totalRoom}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='d-flex'>
                    <div className="mb-3" style={{ width: '175px' }}>
                        <select id="flightNoSelect" className="form-select" value={selectedFlightNo} onChange={handleFlightNoChange}>
                            <option value="">Select Flight No</option>
                            <option value="All">All</option>
                            {Object.keys(groupedData).map(flightNo => (
                                <option key={flightNo} value={flightNo}>{flightNo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3 ms-2" style={{ width: '165px' }}>
                        <select id="boardingStatusSelect" className="form-select" value={selectedBoardingStatus} onChange={handleBoardingStatusChange}>
                            <option value="">Select Boarding Status</option>
                            <option value="Boarded">Boarded</option>
                            <option value="NotBoarded">Not Boarded</option>
                        </select>
                    </div>
                </div>
                <div className='table-responsive'>
                    <table className="table table-striped mt-4 d-none d-md-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th className=''>Photo</th>
                                <th className=''>Guest ID</th>
                                <th >Name</th>
                                <th className=''>Flight No</th>
                                <th>Board</th>
                                <th className='' style={{ width: '10%' }}>Room No</th>
                                <th className=''>Check In</th>
                                <th className=''>Check Out</th>
                                <th className=''>Gift</th>
                                <th className=''>PAX</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.IDDetID}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={getImageSrc(item.Picture)}
                                            alt="User Photo"
                                            style={{ width: '80px', height: '80px' }}
                                            onError={(e) => { e.target.src = user; }} // Set the default image on error
                                        />
                                    </td>
                                    <td>{item.GuestId}</td>
                                    <td>{item.Name}<br /><a href={`tel:${item.PhoneNumber}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                        {item.PhoneNumber}</a></td>
                                    <td>{item.FlightNo}</td>
                                    <td >
                                        <div className='d-flex justify-content-center  align-item-center'>
                                            <input
                                                type="checkbox"
                                                checked={item.Boarded === 1}
                                                onChange={() => handleCheckboxChange(item.IDDetID, 'Boarded')}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.RoomNo}
                                            onChange={(e) => handleRoomNoChange(item.IDDetID, e.target.value)}
                                            onBlur={() => handleRoomNoBlur(item.IDDetID)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <div className='d-flex justify-content-center  align-item-center'>
                                            <input
                                                type="checkbox"
                                                checked={item.CheckIN === 1}
                                                onChange={() => handleCheckboxChange(item.IDDetID, 'CheckIN')}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='d-flex justify-content-center  align-item-center'>
                                            <input
                                                type="checkbox"
                                                checked={item.CheckOut === 1}
                                                onChange={() => handleCheckboxChange(item.IDDetID, 'CheckOut')}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='d-flex justify-content-center  align-item-center'>
                                            <input
                                                type="checkbox"
                                                checked={item.Gift === 1}
                                                onChange={() => handleCheckboxChange(item.IDDetID, 'Gift')}
                                            />
                                        </div>
                                    </td>
                                    <td>{item.PaxNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-md-none">
                    {filteredData.map((item) => (
                        <div key={item.IDDetID} className="card card-custom mb-4" style={{ width: '100%' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div>
                                        <img
                                            src={getImageSrc(item.Picture)}
                                            alt="User Photo"
                                            className="img-thumbnail img-thumbnail-custom"
                                            onError={(e) => { e.target.src = user; }} // Set the default image on error
                                        />
                                    </div>
                                    <div className='ms-3'>
                                        <h5 className="card-title">{item.Name}</h5>
                                        <p className="card-text">Guest ID: {item.GuestId}</p>
                                        <p className="card-text">Flight No: {item.FlightNo}</p>
                                        <p className="card-text">PAX NO: {item.PaxNo}</p>
                                        <p className="card-text">
                                            Phone:&nbsp;
                                            <a href={`tel:${item.PhoneNumber}`} className="phone-number">
                                                {item.PhoneNumber}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor={`roomNo${item.IDDetID}`}>Room No</label>
                                        <input
                                            type="text"
                                            id={`roomNo${item.IDDetID}`}
                                            value={item.RoomNo}
                                            onChange={(e) => handleRoomNoChange(item.IDDetID, e.target.value)}
                                            onBlur={() => handleRoomNoBlur(item.IDDetID)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className='d-flex p-0 justify-content-around custom-cardStyle'>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`boarded${item.IDDetID}`}
                                                    checked={item.Boarded === 1}
                                                    onChange={() => handleCheckboxChange(item.IDDetID, 'Boarded')}
                                                />
                                                <label className="form-check-label" htmlFor={`boarded${item.IDDetID}`}>Boarded</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 ms-1 me-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`checkIn${item.IDDetID}`}
                                                    checked={item.CheckIN === 1}
                                                    onChange={() => handleCheckboxChange(item.IDDetID, 'CheckIN')}
                                                />
                                                <label className="form-check-label" htmlFor={`checkIn${item.IDDetID}`}>Check In</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`checkOut${item.IDDetID}`}
                                                    checked={item.CheckOut === 1}
                                                    onChange={() => handleCheckboxChange(item.IDDetID, 'CheckOut')}
                                                />
                                                <label className="form-check-label" htmlFor={`checkOut${item.IDDetID}`}>Check Out</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`Gift${item.IDDetID}`}
                                                    checked={item.Gift === 1}
                                                    onChange={() => handleCheckboxChange(item.IDDetID, 'Gift')}
                                                />
                                                <label className="form-check-label" htmlFor={`Gift${item.IDDetID}`}>Gift</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}

export default HomeComponent;
