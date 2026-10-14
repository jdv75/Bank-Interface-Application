import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

function RequiredAuth({children} : {children: ReactNode}) {
    const {account} = useAuth();
    if (!account) return <Navigate to="/login" replace />;
    return children;
}

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
                            <RequiredAuth>
                                <DashboardLayout>
                                    <Home />
                                </DashboardLayout>
                            </RequiredAuth>
                        }
                    />
                    <Route
                        path="/accounts"
                        element={
                            <RequiredAuth>
                                <DashboardLayout>
                                    <Accounts />
                                </DashboardLayout>
                            </RequiredAuth>
                        }
                    />
                    <Route
                        path="/deposit"
                        element={
                            <RequiredAuth>
                                <DashboardLayout>
                                    <Deposit />
                                </DashboardLayout>
                            </RequiredAuth>   
                      }
                    />
                    <Route
                        path="/withdraw"
                        element={
                            <RequiredAuth>
                                <DashboardLayout>
                                    <Withdraw />
                                </DashboardLayout>
                            </RequiredAuth>  
                      }
                    />
                    <Route
                        path="/transfer"
                        element={
                            <RequiredAuth>
                                <DashboardLayout>
                                    <Transfer />
                                </DashboardLayout>
                            </RequiredAuth>
                      }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <RequiredAuth>
                                <DashboardLayout>
                                    <Transactions />
                                </DashboardLayout>
                            </RequiredAuth>
                      }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
