import './App.css';
import {useState, useEffect} from 'react';
import { Register } from './Components/register';

function App() {

  const [initialState, setState] = useState([])
  
  
  useEffect(()=> {
    fetch('http://127.0.0.1:5000/api/users').then(response => {
      if(response.status === 200){
        return response.json()
      }
    }).then(data => setState(data))
  }, [])

  return (
    <div className="App">
      <Register data={initialState}/>
    </div>
  );
}

export default App;