import React from "react";
import Lottie from "lottie-react";

import error404Anim from "../assets/Error-404.json";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181828] to-[#232347] px-4 py-12">
      <div className="flex flex-col items-center">
        <div className="w-72 h-72 mb-6">
          <Lottie
            autoplay
            loop
            animationData={error404Anim}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-4 text-center">
          404 - Page Not Found
        </h1>
        <p className="text-gray-300 text-lg mb-8 text-center max-w-xl">
          Oops! The page you are looking for does not exist. Maybe you mistyped the URL or followed a broken link.
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound; 