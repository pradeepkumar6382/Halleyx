import React, { useEffect } from "react";

const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="flex justify-between items-center border border-white bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg animate-growUp">
        <span>{message}</span>
        <button className="ml-4 text-sm underline" onClick={() => window.location.href = "/cart"}>
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
