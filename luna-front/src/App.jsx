import "./utils/global.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rotas } from "./routes.jsx";


function App() {
  return (
    <>
      <Rotas />
      <ToastContainer />
    </>
  );
}

export default App;