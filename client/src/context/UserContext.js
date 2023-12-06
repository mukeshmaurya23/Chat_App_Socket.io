import { createContext, useContext, useState } from "react";

const initialState = {
  userName: "",
  setUserName: (name) => {},
};

const UserContext = createContext(initialState);

const UserContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const setUserName = (name) => {
    setState((prevState) => ({ ...prevState, userName: name }));
  };

  return (
    <UserContext.Provider value={{ ...state, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export const useUserNameContext = () => useContext(UserContext);
