import { Routes, Route, Navigate } from "react-router";
import { checkAuth } from "./authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";


import ProblemPage from "./pages/ProblemPage";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ProblemCreate from "./component/ProblemCreate"
import AdminDelete from "./component/AdminDelete";
import AdminUpdate from "./component/AdminUpdate";
import AdminUpdateLink from "./component/AdminUpdateLink";
import FrontPage from "./pages/FrontPage";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  } ,[dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<FrontPage/>} />
        <Route path="/home" element={isAuthenticated ? <Homepage></Homepage>:<Navigate to="/signup" />}> </Route>
        <Route path="/login" element={isAuthenticated ?<Navigate to="/"/> : <Login></Login>}> </Route>
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/"/>: <Signup></Signup>}> </Route>
        <Route path="/admin" element={isAuthenticated && user?.role==='admin'?<Admin/>:<Navigate to='/' />}></Route>
        <Route path="/admin/create" element={isAuthenticated && user?.role==='admin'?<ProblemCreate/>:<Navigate to='/' />}></Route>
        <Route path="/admin/delete" element={isAuthenticated && user?.role==='admin'?<AdminDelete/>:<Navigate to='/' />}></Route>
        <Route path="/admin/update" element={isAuthenticated && user?.role==='admin'?<AdminUpdateLink/>:<Navigate to='/' />}></Route>
        <Route path="/admin/update/:id" element={isAuthenticated && user?.role==='admin'?<AdminUpdate/>:<Navigate to='/' />}></Route>
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>
    </>
  )
};
export default App;
