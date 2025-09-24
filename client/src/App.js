import './App.css';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
    .get('/api/products')
    .then(res => res.data)
    .then(data => setData(data));
  }, []);

  return (
    <div className='container my-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
          </tr>
        </thead>
          <tbody>
            { data.map(item => (
              <tr key={item.product_id}>
                <td>{item.product_id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table> 
      </div>
  )};

export default App;