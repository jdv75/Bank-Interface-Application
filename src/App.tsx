import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LandingLayout from "./layouts/LandingLayout";
import Accounts from "./pages/Accounts/Accounts";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;