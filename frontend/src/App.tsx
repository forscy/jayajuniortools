import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoute";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useAppDispatch } from "./redux/hooks";
import { checkAuthenticated } from "./redux/slices/authSlice";

function App() {
  const { loading } = useSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthenticated());
  }, [dispatch]);
  return <AppRoutes />;
}

export default App;
