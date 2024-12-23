// src/Crud/crud.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './crud.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const apiBaseUrl = 'http://localhost:5000/items';

const Crud = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { 
    axios.get(apiBaseUrl).then((response) => {
        setItems(response.data); // This will update the UI with the latest items
      }).catch(() => {
        setError('Failed to fetch items');
      });
  }, []);

  const handleAdd = () => {
    axios.post(apiBaseUrl, { name, description }).then(() => {
        // Refetch after adding the item
        const response = axios.get(apiBaseUrl).then((response) => setItems(response.data));
        console.log('Item added successfully:', response.data);
        setName('');
        setDescription('');
      })
      .catch(() => {
        setError('Failed to add item');
      });
  };

  const handleUpdate = () => {
    if (currentItem) {
      axios.put(`${apiBaseUrl}/${currentItem._id}`, { name, description }).then(() => {
          // Refetch after updating the item
          const response = axios.get(apiBaseUrl).then((response) => setItems(response.data));
          console.log('Item updated successfully:', response.data);
          setName('');
          setDescription('');
          setCurrentItem(null);
        })
        .catch(() => {
          setError('Failed to update item');
        });
    }
  };

  const handleDelete = (id) => {
    const response = axios.delete(`${apiBaseUrl}/${id}`).then(() => {
        setItems(items.filter((item) => item._id !== id));
        console.log('Item deleted successfully:', response.data);
      })
      .catch(() => {
        setError('Failed to delete item');
      });
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setName(item.name);
    setDescription(item.description);
  };

  return (
    <div className="crud-container">
      <h1>CRUD Operations</h1>

      <div className="form-container">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input-field"/>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input-field"/>
        <button className="submit-button" onClick={currentItem ? handleUpdate : handleAdd}> {currentItem ? 'Update Item' : 'Add Item'} </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h2>Items List</h2>
      <div className="items-list">
        {items.map((item, index) => (
          <div key={item._id || index} className="item-card">
            <div className="item-header">
              <h3>{item.name}</h3>
              <div className="action-buttons">
                <button className="edit-button" onClick={() => handleEdit(item)}> <FaEdit /> </button>
                <button className="delete-button" onClick={() => handleDelete(item._id)}> <FaTrashAlt /> </button>
              </div>
            </div>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crud;
