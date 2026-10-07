import "./Sidebar.css";
import logo from "../../assets/images/NeuroBank.png";

import { useState } from "react";

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

    const [isTransactionOpen, setIsTransactionOpen] = useState(true);

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

                        <button
                            type="button"
                            className="menu-item transaction-title"
                            onClick={() => setIsTransactionOpen(!isTransactionOpen)}
                            aria-expanded={isTransactionOpen}
                        >
                            <ArrowRightLeft />
                            <span>Transaction Center</span>
                            <ChevronUp className={isTransactionOpen ? "chevron" : "chevron closed"} />
                        </button>

                        <ul className={isTransactionOpen ? "transaction-submenu" : "transaction-submenu collapsed"}>

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