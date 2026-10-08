import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Accounts from "./pages/Accounts/Accounts";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";
import Transactions from "./pages/Transactions/Transactions";
import Transfer from "./pages/Transfer/Transfer";
import Features from "./pages/Features/Features";
import Security from "./pages/Security/Security";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

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
                    <Route
                        path="/features"
                        element={
                            <LandingLayout>
                                <Features />
                            </LandingLayout>
                        }
                    />
                    <Route
                        path="/security"
                        element={
                            <LandingLayout>
                                <Security />
                            </LandingLayout>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <LandingLayout>
                                <About />
                            </LandingLayout>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <LandingLayout>
                                <Contact />
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
                    <Route
                        path="/deposit"
                        element={
                            <DashboardLayout>
                                <Deposit />
                            </DashboardLayout>
                      }
                    />
                    <Route
                        path="/withdraw"
                        element={
                            <DashboardLayout>
                                <Withdraw />
                            </DashboardLayout>
                      }
                    />
                    <Route
                        path="/transfer"
                        element={
                            <DashboardLayout>
                                <Transfer />
                            </DashboardLayout>
                      }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <DashboardLayout>
                                <Transactions />
                            </DashboardLayout>
                      }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
