import React from 'react';

const SeatPicker = ({ seatMatrix, selectedSeats, onToggleSeat, maxSeats = 10 }) => {
  return (
    <div className="seat-picker-container bg-card p-4 rounded-4 border border-secondary shadow-lg">
      {/* Curved Screen */}
      <div className="screen-container">
        <div className="screen-curve"></div>
        <div className="screen-text">
          <i className="bi bi-display me-2"></i> Screen This Way
        </div>
      </div>

      {/* Seat Rows Matrix */}
      <div className="d-flex flex-column align-items-center overflow-x-auto py-2">
        {seatMatrix &&
          seatMatrix.map((rowGroup) => (
            <div
              key={rowGroup.row}
              className="d-flex align-items-center justify-content-center mb-2 w-100"
              style={{ minWidth: '420px' }}
            >
              {/* Row Label Left */}
              <div
                className="text-secondary fw-bold text-center me-3"
                style={{ width: '24px', fontSize: '0.85rem' }}
              >
                {rowGroup.row}
              </div>

              {/* Seats in Row */}
              <div className="d-flex justify-content-center gap-1 flex-wrap">
                {rowGroup.seats.map((seat) => {
                  const isSelected = selectedSeats.some(
                    (s) => s.seatNumber === seat.seatId
                  );
                  const isBooked = seat.isBooked;

                  let colorClass = `available-${seat.tier.toLowerCase()}`;
                  if (isSelected) colorClass = 'selected';
                  if (isBooked) colorClass = 'booked';

                  return (
                    <button
                      key={seat.seatId}
                      type="button"
                      disabled={isBooked}
                      className={`seat-btn ${colorClass}`}
                      title={`${seat.seatId} (${seat.tier}) - ₹${seat.price}`}
                      onClick={() =>
                        onToggleSeat({
                          seatNumber: seat.seatId,
                          category: seat.tier,
                          price: seat.price,
                        })
                      }
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <div
                className="text-secondary fw-bold text-center ms-3"
                style={{ width: '24px', fontSize: '0.85rem' }}
              >
                {rowGroup.row}
              </div>
            </div>
          ))}
      </div>

      {/* Seating Legend */}
      <div className="d-flex flex-wrap justify-content-center gap-4 mt-4 pt-3 border-top border-secondary small text-secondary">
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn available-silver" style={{ cursor: 'default' }}></span>
          <span>Silver (₹180)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn available-gold" style={{ cursor: 'default' }}></span>
          <span>Gold (₹260)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn available-vip" style={{ cursor: 'default' }}></span>
          <span>VIP Recliner (₹420)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn selected" style={{ cursor: 'default' }}></span>
          <span className="text-light fw-semibold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat-btn booked" style={{ cursor: 'not-allowed' }}></span>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;

