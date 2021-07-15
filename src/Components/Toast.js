import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toast(props) {
  return (
    <ToastContainer
      position={props.position}
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
    />
  );
}

export default Toast;
