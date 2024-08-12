import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Reset the message state before submission
    try {
      const response = await axios.post('http://localhost:3000/userlogin', { email, password });
      if (response.status === 200) {
        console.log("Login successful here");
        router.push("/bookings");
      } else {
        setMessage(response.data.message);
        console.error("Login failed: ", response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An error occurred';
      setMessage(errorMsg);
      console.error('Login error:', errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        {message && (
          <p className="text-red-500 text-center mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              type="submit"
              className="px-6 py-3 text-white bg-blue-500 rounded-md text-lg font-semibold hover:bg-blue-600 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-white bg-gray-500 rounded-md text-lg font-semibold hover:bg-gray-600 transition"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
