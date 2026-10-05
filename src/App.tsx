import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Accounts from "./pages/Accounts/Accounts";
import Home from "./pages/Home/Home";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <DashboardLayout>
                            <Home />
                        </DashboardLayout>
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