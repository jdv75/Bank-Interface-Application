import "./Topbar.css";
import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

import { Search, ChevronDown } from "lucide-react";

type SearchPage = {
    label: string;
    path: string;
}

const pages: SearchPage[] = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Accounts", path: "/accounts" },
    { label: "Deposit", path: "/deposit" },
    { label: "Withdraw", path: "/withdraw" },
    { label: "Transfer", path: "/transfer" },
    { label: "Transactions", path: "/transactions" }
]

function Topbar() {

    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const {logout, account} = useAuth();
    const[menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        navigate("/", { replace: true });
        setTimeout(() => logout(), 100); // To exit to the landing page
    }

    const results = pages.filter((page) => page.label.toLocaleLowerCase().includes(query.toLowerCase()));

    function goTo(path: string) {
        navigate(path);
        setQuery("");
        setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if(event.key === "Enter" && results.length > 0) {
            goTo(results[0].path);
        }

        if(event.key === "Escape") {
            setIsOpen(false);
        }
    }

    return (
        <header className="topbar">

            <div className="search-bar">
                <Search />

                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    onKeyDown={handleKeyDown}
                />

                {isOpen && (
                    <ul className="search-results">
                        {results.length === 0 && (
                            <li className="search-empty">No results</li>
                        )}
                        {results.map((page) => (
                            <li key={page.path}>
                                <button
                                    type="button"
                                    onMouseDown={() => goTo(page.path)}
                                >
                                    {page.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            <div className="profile" onClick={() => setMenuOpen((open) => !open)}>
                <div className="profile-info">
                    <span className="profile-name">{account?.accountId ?? "Guest"}</span>
                    <span className="profile-role">Personal Account</span>
                </div>
                <div className="profile-picture">
                    <span>{(account?.accountId ?? "GE").slice(0, 2).toUpperCase()}</span>
                </div>
                <ChevronDown className="profile-arrow" />
                {menuOpen && (
                    <div className="profile-menu">
                        <button type="button" onClick={handleLogout}>
                            <LogOut size={16} />
                            Log out
                        </button>
                    </div>
                )}
            </div>

        </header>
    );
}

export default Topbar;