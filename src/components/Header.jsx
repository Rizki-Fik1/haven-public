import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  const [isLandlordsOpen, setIsLandlordsOpen] = useState(false);

  // Placeholder functions - ganti dengan fungsi Anda sendiri
  const handleViewHomes = () => {
    console.log("View Homes clicked");
    // TODO: Tambahkan logika navigasi ke halaman view homes
  };

  const handleLocations = () => {
    console.log("Locations clicked");
    // TODO: Tambahkan logika navigasi ke halaman locations
  };

  const handleWhyCove = () => {
    console.log("Why Cove clicked");
    // TODO: Tambahkan logika navigasi ke halaman why cove
  };

  const handleCommunity = () => {
    console.log("Community clicked");
    // TODO: Tambahkan logika navigasi ke halaman community
  };

  const handleLandlordsClick = () => {
    setIsLandlordsOpen(!isLandlordsOpen);
    console.log("Landlords dropdown toggled");
    // TODO: Tambahkan logika untuk dropdown landlords
  };

  const handleLogoClick = () => {
    console.log("Logo clicked");
    // TODO: Tambahkan logika navigasi ke homepage
  };

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <div className="logo" onClick={handleLogoClick}>
          <svg
            width="100"
            height="40"
            viewBox="0 0 100 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="30"
              fill="#4F46E5"
              fontSize="28"
              fontWeight="600"
              fontFamily="Arial, sans-serif"
            >
              cove
            </text>
          </svg>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          <button
            className="nav-button nav-button-primary"
            onClick={handleViewHomes}
          >
            view homes
          </button>

          <button className="nav-button" onClick={handleLocations}>
            locations
          </button>

          <button className="nav-button" onClick={handleWhyCove}>
            why Cove
          </button>

          <button className="nav-button" onClick={handleCommunity}>
            community
          </button>

          <div className="dropdown-wrapper">
            <button
              className="nav-button nav-button-dropdown"
              onClick={handleLandlordsClick}
            >
              landlords
              <svg
                className={`dropdown-icon ${isLandlordsOpen ? "open" : ""}`}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown menu - customize sesuai kebutuhan */}
            {isLandlordsOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item">For Landlords</button>
                <button className="dropdown-item">Property Management</button>
                <button className="dropdown-item">Resources</button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
