import "./utils/global.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rotas } from "./routes.jsx";
import { UserProvider } from './context/userContext.jsx';


function App() {
  return (
    <UserProvider>
      <Rotas />
      <ToastContainer />
    </UserProvider>
  );
}

export default App;