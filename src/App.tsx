import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Accounts from "./pages/Accounts/Accounts";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route
                        path="/"
                        element={
                            <LandingLayout>
                                <Landing />
                            </LandingLayout>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Authenticated */}
                    <Route
                        path="/dashboard"
                        element={
                            <DashboardLayout>
                                <Home />
                            </DashboardLayout>
                        }
                    />
                    <Route
                        path="/accounts"
                        element={
                            <DashboardLayout>
                                <Accounts />
                            </DashboardLayout>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;