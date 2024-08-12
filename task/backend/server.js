// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const bcrypt = require('bcryptjs');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // For parsing application/json
app.use(cors());

app.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany(); // Retrieve all users
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching users' });
    }
  });

app.post('/addusers', async (req, res) => {
    try {
      const { name, email, mobile, password } = req.body;
  
      // Validate input
      if (!name || !email || !mobile || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          mobile,
          password: hashedPassword,
        },
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  });

  app.post('/createbooking', async (req, res) => {
    try {
      const { name, passportNumber, validDate, netAmount, paidAmount, paymentStatus } = req.body;
  
      // Validate input
      if (!name || !passportNumber || !validDate || netAmount === undefined || paidAmount === undefined || !paymentStatus) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Validate payment status
      if (!['PAID_PARTIAL', 'PENDING_PARTIAL'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
  
      // Create a new booking
      const newBooking = await prisma.bookings.create({
        data: {
          name,
          passportNumber,
          validDate: new Date(validDate), // Ensure validDate is a Date object
          netAmount,
          paidAmount,
          paymentStatus
        },
      });
  
      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'An error occurred while creating the booking' });
    }
  });
  app.get('/allbookings', async (req, res) => {
    try {
      const bookings = await prisma.bookings.findMany(); // Retrieve all bookings
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An error occurred while fetching users' });
    }
  });
  

  app.post('/userlogin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Authentication successful
      res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  });
  

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
