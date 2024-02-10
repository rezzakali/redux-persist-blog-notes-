import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="signin"
        element={!isLoggedIn ? <SignIn /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
