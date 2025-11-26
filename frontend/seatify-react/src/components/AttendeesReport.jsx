import React, { useState } from 'react';
import '../styles/style.css';

const AttendeesReport = ({ isOpen, onClose, eventName = 'Sample Event' }) => {
    const rows = 5;
    const cols = 8;
    const bookedSeats = ["B2", "D4", "C3"]; // match EventViewModal

    const [attendees] = useState([
        { id: 1, name: 'Ali Alansari', email: 'ali@example.com', checkInTime: '2024-01-15 10:30 AM', seatNumber: 'B2' },
        { id: 2, name: 'Hussain Dashti', email: 'hussain@example.com', checkInTime: '2024-01-15 10:45 AM', seatNumber: 'D4' },
        { id: 3, name: 'Mohammed Riyad', email: 'mo@example.com', checkInTime: '2024-01-15 11:00 AM', seatNumber: 'C3' },
    ]);

    if (!isOpen) return null;

    const checkedIn = attendees.filter(a => a.checkInTime).length;
    const totalAttendees = attendees.length;

    const renderSeatGrid = () => {
        const seats = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const seatId = `${String.fromCharCode(65 + r)}${c + 1}`;
                const isBooked = bookedSeats.includes(seatId);
                // show seat id inside box so grid matches EventViewModal
                seats.push(
                    <div
                        key={seatId}
                        className={`seat ${isBooked ? "seat-booked" : "seat-available"}`}
                        title={seatId}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                    >
                        {seatId}
                    </div>
                );
            }
        }

        return (
            <div className="seat-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {seats}
            </div>
        );
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content attendees-report" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Attendees Report - {eventName}</h2>
                    <button className="cancel-btn" onClick={onClose}>×</button>
                </div>

                <div className="summary-stats">
                    <div className="stat-card">
                        <p className="stat-label">Total Attendees</p>
                        <p className="stat-value">{totalAttendees}</p>
                    </div>
                </div>

                <div className="attendees-list" style={{ marginTop: 20 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Seat</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px' }}>Check-In Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.map((attendee) => (
                                <tr key={attendee.id}>
                                    <td style={{ padding: '8px 6px' }}>{attendee.name}</td>
                                    <td style={{ padding: '8px 6px' }}>{attendee.email}</td>
                                    <td style={{ padding: '8px 6px' }}>{attendee.seatNumber || '-'}</td>
                                    <td style={{ padding: '8px 6px' }}>{attendee.checkInTime || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* seat layout to visually match EventViewModal */}
                <div style={{ marginTop: 22 }}>
                    {renderSeatGrid()}
                    <div className="legend" style={{ justifyContent: 'center', marginTop: 12 }}>
                        <div><span className="seat seat-booked" style={{ width: 16, height: 16 }}></span>Booked</div>
                        <div><span className="seat seat-available" style={{ width: 16, height: 16 }}></span>Available</div>
                    </div>
                </div>

                <div className="modal-footer" style={{ marginTop: 18 }}>
                    <button className="continue-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}; 

export default AttendeesReport;
