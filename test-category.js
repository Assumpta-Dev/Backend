// Simple test to check if the server is working
const axios = require('axios');
const FormData = require('form-data');

async function testCategoryCreation() {
  try {
    const formData = new FormData();
    formData.append('name', 'Test Category');
    formData.append('description', 'Test Description');
    
    const response = await axios.post('http://localhost:7000/category', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer your_token_here' // Replace with actual token
      }
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCategoryCreation();