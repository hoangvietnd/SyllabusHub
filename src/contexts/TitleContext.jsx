import React, { createContext, useState } from 'react';

const TitleContext = createContext();
export default TitleContext;

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState('CourseHub');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
