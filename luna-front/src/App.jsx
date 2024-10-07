import './global.css';
import { Outlet, Router } from 'react-router-dom';



function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
