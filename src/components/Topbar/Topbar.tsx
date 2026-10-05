import "./Topbar.css";

import {
    Search,
    ChevronDown
} from "lucide-react";

function Topbar() {
    return (
        <header className="topbar">

            <div className="search-bar">
                <Search />

                <input
                    type="text"
                    placeholder="Search..."
                />
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