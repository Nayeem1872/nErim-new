"use client";
import { useState, useEffect } from "react";
import { Layout } from 'antd';
const { Footer } = Layout;

const DashboardFooter = () => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <>
      {domLoaded && (
        <>
          <style jsx>{`
            .footer-container {
              position: fixed;
              bottom: 0;
              width: 100%;
              background-color: #f0f2f5; 
              text-align: center;
            }
          `}</style>

          <div className="footer-container">
            <Footer>
              ©2023 Created by Alo IT
            </Footer>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardFooter;
