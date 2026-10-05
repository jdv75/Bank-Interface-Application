import "./Sidebar.css";
import logo from "../../assets/images/NeuroBank.png";

import {
    LayoutDashboard,
    WalletCards,
    ArrowRightLeft,
    List,
    ArrowDown,
    ArrowUp,
    ChevronUp
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <img src={logo} alt="NeuroBank logo" />
                <h2>NeuroBank</h2>
            </div>

            <nav>
                <ul className="sidebar-menu">

                    <li>
                        <NavLink to="/dashboard" className="menu-item">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/accounts" className="menu-item">
                            <WalletCards />
                            <span>Accounts</span>
                        </NavLink>
                    </li>

                    <li className="transaction-section">

                        <div className="menu-item transaction-title">
                            <ArrowRightLeft />
                            <span>Transaction Center</span>
                            <ChevronUp className="chevron" />
                        </div>

                        <ul className="transaction-submenu">

                            <li>
                                <NavLink to="/deposit">
                                    <ArrowDown />
                                    <span>Deposit</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/withdraw">
                                    <ArrowUp />
                                    <span>Withdraw</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/transfer">
                                    <ArrowRightLeft />
                                    <span>Transfer</span>
                                </NavLink>
                            </li>

                        </ul>

                    </li>

                    <li className="transactions">
                        <NavLink to="/transactions" className="menu-item">
                            <List />
                            <span>Transactions</span>
                        </NavLink>
                    </li>

                </ul>
            </nav>

        </aside>
    );
}

export default Sidebar;