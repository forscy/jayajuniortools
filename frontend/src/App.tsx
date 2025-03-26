import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoute";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useAppDispatch } from "./redux/hooks";
import { checkAuthenticated } from "./redux/slices/authSlice";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthenticated());
  }, [dispatch, isAuthenticated]);
  return <AppRoutes />;
}

export default App;
