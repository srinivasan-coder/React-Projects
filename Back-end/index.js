const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

// Initialize the app
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI if hosted remotely
const client = new MongoClient(uri);
const dbName = 'sample'; 
const collectionName = 'tbluser'; 
const crudCollectionName = 'tblcrud'; 

let db, collection, crudCollection;
client.connect()
  .then(() => {
    db = client.db(dbName);
    collection = db.collection(collectionName);
    crudCollection = db.collection(crudCollectionName);
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Register API
app.post('/register', async (req, res) => { 
  const { name, userid, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await collection.findOne({ userid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert the new user into the database
    await collection.insertOne({ name, userid, password: password });
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { userid, password } = req.body;

  try {
    // Find user by userid
    const user = await collection.findOne({ userid });
    if (!user) {
      return res.status(401).json({ message: 'Invalid userid or password' });
    }

    // Direct comparison of entered password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid userid or password' });
    }

    // If successful
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await crudCollection.find({}).toArray();
    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a item by ID (Read)
app.get('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await crudCollection.findOne({ _id: ObjectId(itemId) });
    if (!item) {
      return res.status(404).json({ message: 'item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/items', async (req, res) => {
  const { name, description } = req.body;

  try {
      const result = await crudCollection.insertOne({ name, description }
    );

    res.status(200).json({ message: 'item added successfully' });
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a item (Update)
app.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const { name, description } = req.body;
  
  try {
    const result = await crudCollection.updateOne({ _id: new ObjectId(itemId) },{ $set: { name, description }});

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'item not found' });
    }
    res.status(200).json({ message: 'item updated successfully' });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a item (Delete)
app.delete('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await crudCollection.deleteOne({ _id: new ObjectId(itemId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'item not found' });
    }
    res.status(200).json({ message: 'item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { name } = req.query; // Get the search query parameter
    
    // Perform aggregation to search by name
    const items = await crudCollection.aggregate([
      {
        $match: {
          name: { $regex: name, $options: 'i' } // Case-insensitive search
        }
      }
    ]).toArray();

    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
