import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ChessGame from "@/components/pages/ChessGame";
import Layout from "@/components/organisms/Layout";

function App() {
return (
    <BrowserRouter>
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
          className="z-50 !top-16 sm:!top-4"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;