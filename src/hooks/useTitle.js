import { useContext } from 'react';
import TitleContext from '../contexts/TitleContext';

const useTitle = () => {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};

export default useTitle;
