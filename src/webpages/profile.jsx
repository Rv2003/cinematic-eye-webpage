import axios from "axios";
import { useState, useEffect } from "react";
import { LoadingScreen } from "../components/loading";

export function Profile({ token }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          'http://localhost:5500/api/v1/booking/records',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const booking = response.data.data;
        console.log(booking);
        setBookings(Array.isArray(booking) ? booking : [booking]);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const styles = {
    container: {
      backgroundColor: '#080808',
      color: '#f4f4f4',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '48px',
      minHeight: '100vh',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '32px',
    },
    eyebrow: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.25em',
      color: '#888',
      marginBottom: '8px',
    },
    eyebrowDot: {
      width: '4px',
      height: '4px',
      backgroundColor: '#d4af37',
      borderRadius: '50%',
      display: 'inline-block',
    },
    heading: {
      fontSize: '32px',
      fontWeight: '300',
      letterSpacing: '0.1em',
      margin: 0,
    },
    gold: {
      color: '#d4af37',
      fontWeight: '600',
    },
    userBadge: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '100px',
      fontSize: '12px',
      color: '#aaa',
    },
    tableWrapper: {
      overflowX: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '6px',
      background: 'rgba(255, 255, 255, 0.01)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      fontSize: '13px',
    },
    tableHeaderRow: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(255, 255, 255, 0.02)',
    },
    th: {
      padding: '16px 20px',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: '#777',
      fontWeight: '500',
    },
    tableRow: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      transition: 'background 0.2s',
    },
    td: {
      padding: '16px 20px',
      color: '#ccc',
    },
    statusBadge: {
      padding: '4px 10px',
      borderRadius: '100px',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    statusUpcoming: {
      background: 'rgba(212, 175, 55, 0.12)',
      color: '#d4af37',
      border: '1px solid rgba(212, 175, 55, 0.3)',
    },
    statusCompleted: {
      background: 'rgba(76, 175, 80, 0.12)',
      color: '#81c784',
      border: '1px solid rgba(76, 175, 80, 0.3)',
    },
    statusCancelled: {
      background: 'rgba(244, 67, 54, 0.12)',
      color: '#e57373',
      border: '1px solid rgba(244, 67, 54, 0.3)',
    },
    actionBtn: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#f4f4f4',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '11px',
      cursor: 'pointer',
    },
    noResults: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontStyle: 'italic',
    },
  };

  const statusStyleMap = {
    Upcoming: styles.statusUpcoming,
    Completed: styles.statusCompleted,
    Cancelled: styles.statusCancelled,
  };

  function BookingRow({ booking }) {
    const eventDate = booking.eventdate
      ? new Date(booking.eventdate).toLocaleDateString()
      : '—';

    return (
      <tr style={styles.tableRow}>
        <td style={styles.td}>{booking._id}</td>
        <td style={styles.td}>{booking.session}</td>
        <td style={styles.td}>{eventDate}</td>
        <td style={styles.td}>{booking.location ?? '—'}</td>
        <td style={styles.td}>
          <span
            style={{
              ...styles.statusBadge,
              ...(statusStyleMap[booking.status] || {}),
            }}
          >
            {booking.status ?? '—'}
          </span>
        </td>
        <td style={styles.td}>{booking.amount != null ? `Rs${booking.amount}` : '—'}</td>
        <td style={styles.td}>
          <button style={styles.actionBtn}>View</button>
        </td>
      </tr>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <span style={styles.eyebrow}>
            <span style={styles.eyebrowDot}></span> Client Portal
          </span>
          <h1 style={styles.heading}>
            Your <span style={styles.gold}>Bookings</span>
          </h1>
        </div>
        <div style={styles.userBadge}>Client Account</div>
      </div>

      {/* Standard Table View */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Booking ID</th>
              <th style={styles.th}>Session Type</th>
              <th style={styles.th}>Date & Time</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))
            ) : (
              <tr>
                <td style={styles.noResults} colSpan={7}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}