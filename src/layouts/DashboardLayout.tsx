import type { ReactNode } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";

import "./DashboardLayout.css";

interface DashboardLayoutProps {
    children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="dashboard-layout">

            <aside className="dashboard-sidebar">
                <Sidebar />
            </aside>

            <header className="dashboard-topbar">
                <Topbar />
            </header>

            <main className="dashboard-content">
                {children}
            </main>

        </div>
    );
}

export default DashboardLayout;