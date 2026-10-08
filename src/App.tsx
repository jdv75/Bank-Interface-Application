import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Accounts from "./pages/Accounts/Accounts";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Transactions from "./pages/Transactions/Transactions";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <LandingLayout>
                            <Landing />
                        </LandingLayout>
                    }
                />
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
                    path="/transactions"
                    element={
                        <DashboardLayout>
                            <Transactions />
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;