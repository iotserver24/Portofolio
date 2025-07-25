import React, { useState } from "react";

const UPI_ADDRESS = "anishk24@fam"; // Updated UPI address
const QR_IMAGE = "/qr.jpg"; // Corrected QR code image path for Vite/React public folder

const Donate = () => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181828] to-[#232347] px-4 py-12">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-4 text-center">
          Support My Work
        </h1>
        <p className="text-gray-300 text-center mb-6">
          If you like my projects and want to support future development, consider making a donation. Your support means a lot!
        </p>
        <div className="flex flex-col gap-3 w-full mb-6">
          <a
            href="https://www.buymeacoffee.com/r3ap3redit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center"
          >
            <img src="https://img.buymeacoffee.com/button-api/?text=International donation&emoji=💝&slug=r3ap3redit&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" alt="Donate via BuyMeACoffee" className="h-12" />
          </a>
          <a
            href="https://razorpay.me/@megavault"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-2 rounded-lg shadow-md text-center transition-colors duration-200 flex items-center justify-center"
          >
            Donate in India
          </a>
        </div>
        <img
          src={QR_IMAGE}
          alt="Donate QR Code"
          className="w-48 h-48 object-contain rounded-lg border border-white/10 mb-2 shadow-lg bg-white/10 cursor-pointer"
          onClick={() => setShowQR(true)}
        />
        <p className="text-xs text-gray-400 mb-4">(Click to see the QR in fullscreen)</p>
        {/* Fullscreen QR Modal */}
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowQR(false)}>
            <img
              src={QR_IMAGE}
              alt="Donate QR Code Fullscreen"
              className="max-w-full max-h-full rounded-xl border-4 border-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute top-6 right-6 text-white text-3xl font-bold bg-black/60 rounded-full px-4 py-2 hover:bg-black/80 transition"
              onClick={() => setShowQR(false)}
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex flex-col items-center mb-4 w-full">
          <span className="text-gray-400 text-sm mb-1">UPI Address (anishk24@fam)</span>
          <div className="flex items-center w-full justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-l-md text-sm select-all border border-r-0 border-white/10">
              {UPI_ADDRESS}
            </span>
            <button
              onClick={handleCopy}
              className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-3 py-1 rounded-r-md text-white font-medium text-sm border border-l-0 border-white/10 hover:from-[#7c3aed] hover:to-[#a21caf] transition-colors duration-200"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <p className="text-green-400 text-center mt-4 font-semibold">
          Thank you for your support!
        </p>
      </div>
    </div>
  );
};

export default Donate; 