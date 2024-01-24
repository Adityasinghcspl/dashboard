import { useState, ReactNode, FC } from 'react';
import DataContext from './DataContext';

interface ContextProviderProps {
  children: ReactNode;
}

interface Data {
  status: boolean;
}

interface UserDataItem {
  _id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
}

const DataContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const [userList, setUserList] =useState<UserDataItem>();
  const [status, setStatus] = useState<Data>(); 

  return (
    <DataContext.Provider value={{ userList, setUserList, status, setStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
