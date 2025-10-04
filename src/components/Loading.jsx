import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-stone-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
