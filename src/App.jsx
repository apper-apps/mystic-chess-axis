import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import ChessGame from '@/components/pages/ChessGame';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-body">
        <Layout>
          <Routes>
            <Route path="/" element={<ChessGame />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;