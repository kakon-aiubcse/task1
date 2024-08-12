import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
const Booking = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    validDate: '',
    netAmount: '',
    paidAmount: '',
    paymentStatus: 'PAID_PARTIAL'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch the list of bookings when the component mounts
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/allbookings'); // Adjust the API endpoint as needed
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('An error occurred while fetching the bookings.');
      }
    };

    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert netAmount and paidAmount to numbers
      const data = {
        ...formData,
        netAmount: parseFloat(formData.netAmount),
        paidAmount: parseFloat(formData.paidAmount),
        validDate: formData.validDate // assuming validDate is already in the correct format
      };

      const response = await axios.post('http://localhost:3000/createbooking', data);
      console.log('Booking created:', response.data);

      // Show success message
      setSuccessMessage('Booking created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds

      // Update the bookings list
      setBookings(prevBookings => [response.data, ...prevBookings]);
      
      // Clear form data
      setFormData({
        name: '',
        passportNumber: '',
        validDate: '',
        netAmount: '',
        paidAmount: '',
        paymentStatus: 'PAID_PARTIAL'
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      setError('An error occurred while creating the booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-xl font-bold mb-2">Create Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-1">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="passportNumber">Passport Number</label>
          <input
            id="passportNumber"
            name="passportNumber"
            type="text"
            value={formData.passportNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="validDate">Valid Date</label>
          <input
            id="validDate"
            name="validDate"
            type="date"
            value={formData.validDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="netAmount">Net Amount</label>
          <input
            id="netAmount"
            name="netAmount"
            type="number"
            step="0.01"
            value={formData.netAmount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="paidAmount">Paid Amount</label>
          <input
            id="paidAmount"
            name="paidAmount"
            type="number"
            step="0.01"
            value={formData.paidAmount}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="paymentStatus">Payment Status</label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="PAID_PARTIAL">Paid Partial</option>
            <option value="PENDING_PARTIAL">Pending Partial</option>
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {loading ? 'Creating...' : 'Create Booking'}
        </button> 
        <button
              type="button"
              onClick={() => router.back()}
              className="py-2 px-4 text-white bg-gray-500 rounded-md text-lg  hover:bg-gray-600 transition"
            >
              Go Back
            </button>
      </form>

      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded shadow-lg">
          {successMessage}
        </div>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Booking List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Passport Number</th>
            <th className="py-2 px-4 border-b">Valid Date</th>
            <th className="py-2 px-4 border-b">Net Amount</th>
            <th className="py-2 px-4 border-b">Paid Amount</th>
            <th className="py-2 px-4 border-b">Payment Status</th>
            <th className="py-2 px-4 border-b">Creation</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 text-center">No bookings found</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-2 px-4 border-b">{booking.name}</td>
                <td className="py-2 px-4 border-b">{booking.passportNumber}</td>
                <td className="py-2 px-4 border-b">{new Date(booking.validDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">${booking.netAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">${booking.paidAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{booking.paymentStatus.replace('_', ' ')}</td>
                <td className="py-2 px-4 border-b">{booking.createdAt.replace('_', ' ')}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;
