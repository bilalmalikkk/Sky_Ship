import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Test: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('');

  const testAPI = async () => {
    try {
      setApiStatus('Testing API...');
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      if (response.ok) {
        setApiStatus('✅ Backend is running and accessible');
      } else {
        setApiStatus(`⚠️ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      setApiStatus(`❌ Backend connection failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-8">This is a test page to verify routing works</p>
        
        <div className="mb-8">
          <button 
            onClick={testAPI}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium mb-4"
          >
            Test Backend Connection
          </button>
          {apiStatus && (
            <p className="text-sm text-gray-700">{apiStatus}</p>
          )}
        </div>
        
        <div className="space-x-4">
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Go Home
          </Link>
          <Link 
            to="/admin" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Go Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Test;
