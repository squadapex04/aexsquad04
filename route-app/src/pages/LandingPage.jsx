import React from 'react';

const LandingPage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe 
        src="/home.html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Ecologix Landing Page"
      />
    </div>
  );
};

export default LandingPage;
