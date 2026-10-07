import "./Topbar.css";
import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Search, ChevronDown } from "lucide-react";

type SearchPage = {
    label: string;
    path: string;
}

const pages: SearchPage[] = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Accounts", path: "/accounts" }
]

function Topbar() {

    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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


            <div className="profile">

                <div className="profile-picture">
                    <span>JD</span>
                </div>

                <div className="profile-info">
                    <span className="profile-name">
                        Juan David
                    </span>

                    <span className="profile-role">
                        Personal Account
                    </span>
                </div>

                <ChevronDown className="profile-arrow" />

            </div>

        </header>
    );
}

export default Topbar;