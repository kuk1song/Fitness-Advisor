import React, { useState } from 'react';

function InputWithDynamicColor({ name, placeholder, value, onChange }) {
  const [color, setColor] = useState('black');

  const handleFocus = () => setColor('#0044cc');  // focus color: blue
  const handleBlur = () => setColor('#555555');    // unfocus color: gray

  return (
    <input 
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
            color,                      
            fontSize: '16px',           
            fontFamily: 'Arial, sans-serif', 
            padding: '10px',            
            width: '260px',             
            marginBottom: '15px',       
            border: '1px solid #cccccc', 
            borderRadius: '5px',        
            outline: 'none',           
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
          }}
        onFocus={handleFocus}
        onBlur={handleBlur}
    />
  );
}

export default InputWithDynamicColor;