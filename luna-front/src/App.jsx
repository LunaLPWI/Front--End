import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './global.css';



function App() {
  return (
    <div>
      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default App;
