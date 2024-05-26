"use client"

import React from 'react'
import { useState, useEffect } from "react";

const Header = () => {

  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);


  return (
    <>
    {domLoaded ? (
      <>

      
<h1>header</h1>
        
        
      </>
    ) : (
      <></>
    )}
  </>
  )
}

export default Header