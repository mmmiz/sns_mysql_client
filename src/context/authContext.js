import { createContext, useEffect, useReducer} from "react";

const AuthReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {...state, currentUser: action.payload};
    case 'LOGOUT':
      return { ...state, currentUser: null };
    default:
      return state;
  }
};

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null
 };

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  // reducer can be separated. 

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
