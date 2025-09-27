import React, { useState, useRef, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Link from "next/link";
import Image from "next/legacy/image";
import MenuData from "../../data/menu/HeaderMenu.json";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

const HeaderOne = () => {
  // Main Menu Toggle
  var menuRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [activeDropdowns, setActiveDropdowns] = useState([]);
  
  // Mobile Menu Toggle
  const [mobileToggle, setMobileToggle] = useState(false);
  const [mobileActiveDropdowns, setMobileActiveDropdowns] = useState([]);
  
  // Desktop dropdown toggle
  const toggleDropdownMenu = () => {
    if (!menuRef.current) return;
    
    const dropdownSelect = menuRef.current.childNodes;
    let dropdownList = [];

    for (let i = 0; i < dropdownSelect.length; i++) {
      const element = dropdownSelect[i];
      if (element.classList.contains("has-dropdown")) {
        dropdownList.push(element);
      }
    }

    dropdownList.forEach((element) => {
      const link = element.children[0];
      if (link) {
        link.addEventListener("click", (e) => {
          // Only prevent default if there's a submenu
          if (element.querySelector(".submenu")) {
            e.preventDefault();
            
            if (element.classList.contains("active")) {
              element.classList.remove("active");
              const submenu = element.querySelector(".submenu");
              if (submenu) submenu.classList.remove("opened");
            } else {
              // Close other dropdowns
              dropdownList.forEach((submenu) => {
                if (element !== submenu) {
                  submenu.classList.remove("active");
                  const submenuEl = submenu.querySelector(".submenu");
                  if (submenuEl) submenuEl.classList.remove("opened");
                }
              });
              
              // Toggle current dropdown
              element.classList.add("active");
              const submenu = element.querySelector(".submenu");
              if (submenu) submenu.classList.add("opened");
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    toggleDropdownMenu();
  }, []);

  // Header Search
  const [searchshow, setSearchShow] = useState(false);
  const headerSearchShow = () => {
    setSearchShow(true);
  };
  const headerSearchClose = () => {
    setSearchShow(false);
  };

  // Mobile Menu Toggle Handler
  const MobileMenuToggler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newToggleState = !mobileToggle;
    setMobileToggle(newToggleState);
    
    const body = document.querySelector("body");
    
    if (newToggleState) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
      setMobileActiveDropdowns([]);
    }
  };

  // Mobile dropdown toggle
  const toggleMobileDropdown = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMobileActiveDropdowns(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Handle mobile submenu toggle
  const toggleMobileSubmenu = (parentIndex, subIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const key = `${parentIndex}-${subIndex}`;
    setMobileActiveDropdowns(prev => {
      if (prev.includes(key)) {
        return prev.filter(i => i !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const body = document.querySelector("body");
      const mobileMenu = document.querySelector(".mobile-menu-overlay");
      const toggler = document.querySelector(".hamburger-menu");
      
      if (mobileToggle && mobileMenu && !mobileMenu.contains(event.target) && !toggler?.contains(event.target)) {
        body.style.overflow = "auto";
        setMobileToggle(false);
        setMobileActiveDropdowns([]);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && mobileToggle) {
        const body = document.querySelector("body");
        body.style.overflow = "auto";
        setMobileToggle(false);
        setMobileActiveDropdowns([]);
      }
    };

    if (mobileToggle) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [mobileToggle]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileToggle) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileToggle]);

  return (
    <>
      <header className="page-header">
        <nav className="navbar navbar__style-three">
          <div className="container-fluid p-l-md-80 p-r-md-80">
            <div className="navbar-inner">
              {/* Logo */}
              <div className="brand-logo-container">
                <Link href="/" legacyBehavior>
                  <a>
                    <Image
                      src="/images/kwithus.png"
                      alt="brand-logo"
                      width={120}
                      height={40}
                      priority
                    />
                  </a>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="main-nav-wrapper d-none d-lg-block">
                <ul className="main-navigation list-inline" ref={menuRef}>
                  {MenuData.map((data, index) =>
                    data.submenu ? (
                      <li className="has-dropdown" key={index}>
                        <Link href={data.path} legacyBehavior>
                          <a>{data.label}</a>
                        </Link>
                        <ul className="submenu">
                          {data.submenu.map((data, index) =>
                            data.thirdmenu ? (
                              <li className="has-dropdown" key={index}>
                                <Link href={data.subpath} legacyBehavior>
                                  <a>{data.sublabel}</a>
                                </Link>
                                <ul className="submenu">
                                  {data.thirdmenu.map((data, index) => (
                                    <li key={index}>
                                      <Link href={data.tpath} legacyBehavior>
                                        <a>{data.tlabel}</a>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ) : (
                              <li key={index}>
                                <Link href={data.subpath} legacyBehavior>
                                  <a>{data.sublabel}</a>
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    ) : (
                      <li key={index}>
                        <Link href={data.path} legacyBehavior>
                          <a>{data.label}</a>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Desktop Extra Features */}
              <div className="navbar-extra-features ml-auto d-none d-lg-flex">
                {/* Auth Buttons */}
                <div className="auth-buttons">
                  <SignedOut>
                    <SignInButton>
                      <button className="btn btn-small bg-grey-dark-one">
                        로그인 / 가입
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>

                {/* Language Dropdown */}
                <Dropdown className="lang-dropdown m-l-xs-10 m-l-md-30">
                  {/* Toggle va Menu istasangiz ochishingiz mumkin */}
                </Dropdown>

                {/* Search Form */}
                <form
                  action="#"
                  className={`navbar-search ${
                    searchshow ? "show-nav-search" : ""
                  }`}
                >
                  <div className="search-field">
                    <input
                      type="text"
                      className="navbar-search-field"
                      placeholder="Search Here..."
                    />
                    <button className="navbar-search-btn" type="button">
                      <i className="fal fa-search" />
                    </button>
                  </div>
                  <span
                    className="navbar-search-close"
                    onClick={headerSearchClose}
                  >
                    <i className="fal fa-times" />
                  </span>
                </form>

                <button
                  className="nav-search-field-toggler m-l-xs-10 m-l-md-30 mr-0"
                  onClick={headerSearchShow}
                >
                  <i className="far fa-search" />
                </button>
              </div>

              {/* Mobile Menu Toggle Button - Zamonaviy Hamburger */}
              <button
                className={`hamburger-menu d-block d-lg-none ${mobileToggle ? "active" : ""}`}
                onClick={MobileMenuToggler}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileToggle}
              >
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${mobileToggle ? "active" : ""}`}>
          <div className="mobile-menu-container">
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <Link href="/" legacyBehavior>
                <a onClick={() => setMobileToggle(false)}>
                  <Image
                    src="/images/kwithus.png"
                    alt="brand-logo"
                    width={100}
                    height={33}
                  />
                </a>
              </Link>
              <button
                className="mobile-menu-close"
                onClick={MobileMenuToggler}
                aria-label="Close mobile menu"
              >
                <i className="fal fa-times" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mobile-search-container">
              <form action="#" className="mobile-search-form">
                <div className="mobile-search-field">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="mobile-search-input"
                  />
                  <button type="submit" className="mobile-search-btn">
                    <i className="far fa-search" />
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Menu Navigation */}
            <nav className="mobile-menu-nav">
              <ul className="mobile-menu-list">
                {MenuData.map((data, parentIndex) => (
                  <li 
                    key={parentIndex} 
                    className={`mobile-menu-item ${data.submenu ? "has-submenu" : ""}`}
                  >
                    {data.submenu ? (
                      <>
                        <div className="mobile-menu-link-wrapper">
                          <Link href={data.path} legacyBehavior>
                            <a 
                              className="mobile-menu-link"
                              onClick={() => setMobileToggle(false)}
                            >
                              {data.label}
                            </a>
                          </Link>
                          <button
                            className={`mobile-submenu-toggle ${
                              mobileActiveDropdowns.includes(parentIndex) ? "active" : ""
                            }`}
                            onClick={(e) => toggleMobileDropdown(parentIndex, e)}
                            aria-label={`Toggle ${data.label} submenu`}
                          >
                            <i className="far fa-angle-down" />
                          </button>
                        </div>
                        <ul 
                          className={`mobile-submenu ${
                            mobileActiveDropdowns.includes(parentIndex) ? "active" : ""
                          }`}
                        >
                          {data.submenu.map((subData, subIndex) => (
                            <li 
                              key={subIndex}
                              className={`mobile-submenu-item ${
                                subData.thirdmenu ? "has-submenu" : ""
                              }`}
                            >
                              {subData.thirdmenu ? (
                                <>
                                  <div className="mobile-submenu-link-wrapper">
                                    <Link href={subData.subpath} legacyBehavior>
                                      <a 
                                        className="mobile-submenu-link"
                                        onClick={() => setMobileToggle(false)}
                                      >
                                        {subData.sublabel}
                                      </a>
                                    </Link>
                                    <button
                                      className={`mobile-submenu-toggle ${
                                        mobileActiveDropdowns.includes(`${parentIndex}-${subIndex}`) 
                                          ? "active" : ""
                                      }`}
                                      onClick={(e) => toggleMobileSubmenu(parentIndex, subIndex, e)}
                                      aria-label={`Toggle ${subData.sublabel} submenu`}
                                    >
                                      <i className="far fa-angle-down" />
                                    </button>
                                  </div>
                                  <ul 
                                    className={`mobile-third-menu ${
                                      mobileActiveDropdowns.includes(`${parentIndex}-${subIndex}`) 
                                        ? "active" : ""
                                    }`}
                                  >
                                    {subData.thirdmenu.map((thirdData, thirdIndex) => (
                                      <li key={thirdIndex} className="mobile-third-menu-item">
                                        <Link href={thirdData.tpath} legacyBehavior>
                                          <a 
                                            className="mobile-third-menu-link"
                                            onClick={() => setMobileToggle(false)}
                                          >
                                            {thirdData.tlabel}
                                          </a>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : (
                                <Link href={subData.subpath} legacyBehavior>
                                  <a 
                                    className="mobile-submenu-link"
                                    onClick={() => setMobileToggle(false)}
                                  >
                                    {subData.sublabel}
                                  </a>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link href={data.path} legacyBehavior>
                        <a 
                          className="mobile-menu-link"
                          onClick={() => setMobileToggle(false)}
                        >
                          {data.label}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Footer */}
            <div className="mobile-menu-footer">
              <div className="mobile-auth-buttons">
                <SignedOut>
                  <SignInButton>
                    <button className="mobile-auth-btn">
                      <i className="far fa-user" />
                      <span>로그인 / 가입</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="mobile-user-profile">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
              
              {/* Social Links (Optional) */}
              <div className="mobile-social-links">
                <a href="#" className="mobile-social-link">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="mobile-social-link">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="mobile-social-link">
                  <i className="fab fa-instagram" />
                </a>
                <a href="#" className="mobile-social-link">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <style jsx>{`
        /* Hamburger Menu Styles */
        .hamburger-menu {
          width: 40px;
          height: 40px;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1001;
          transition: all 0.3s ease;
        }

        .hamburger-box {
          width: 24px;
          height: 24px;
          display: inline-block;
          position: relative;
        }

        .hamburger-inner {
          display: block;
          top: 50%;
          margin-top: -2px;
        }

        .hamburger-inner,
        .hamburger-inner::before,
        .hamburger-inner::after {
          width: 24px;
          height: 2px;
          background-color: #333;
          border-radius: 2px;
          position: absolute;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                      background-color 0.3s ease,
                      opacity 0.3s ease;
        }

        .hamburger-inner::before,
        .hamburger-inner::after {
          content: "";
          display: block;
        }

        .hamburger-inner::before {
          top: -8px;
        }

        .hamburger-inner::after {
          bottom: -8px;
        }

        /* Hamburger Active State */
        .hamburger-menu.active .hamburger-inner {
          transform: rotate(45deg);
          background-color: #fff;
        }

        .hamburger-menu.active .hamburger-inner::before {
          top: 0;
          opacity: 0;
        }

        .hamburger-menu.active .hamburger-inner::after {
          bottom: 0;
          transform: rotate(-90deg);
          background-color: #fff;
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          z-index: 999;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Menu Container */
        .mobile-menu-container {
          position: absolute;
          top: 0;
          right: -320px;
          width: 320px;
          max-width: 90vw;
          height: 100%;
          background-color: #fff;
          box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
          transition: right 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .mobile-menu-overlay.active .mobile-menu-container {
          right: 0;
        }

        /* Mobile Menu Header */
        .mobile-menu-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-menu-close {
          width: 40px;
          height: 40px;
          background: #f5f5f5;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
          color: #333;
        }

        .mobile-menu-close:hover {
          background: #e0e0e0;
          transform: rotate(90deg);
        }

        /* Mobile Search */
        .mobile-search-container {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }

        .mobile-search-field {
          position: relative;
        }

        .mobile-search-input {
          width: 100%;
          padding: 12px 45px 12px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 25px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .mobile-search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .mobile-search-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          background: #007bff;
          border: none;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-search-btn:hover {
          background: #0056b3;
        }

        /* Mobile Menu Navigation */
        .mobile-menu-nav {
          flex: 1;
          padding: 20px 0;
        }

        .mobile-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-menu-item {
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-menu-link-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-menu-link {
          flex: 1;
          padding: 15px 20px;
          color: #333;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: block;
        }

        .mobile-menu-link:hover {
          color: #007bff;
          background-color: #f8f9fa;
          padding-left: 25px;
        }

        .mobile-submenu-toggle {
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.3s ease;
          margin-right: 10px;
        }

        .mobile-submenu-toggle:hover {
          color: #007bff;
        }

        .mobile-submenu-toggle.active {
          transform: rotate(180deg);
        }

        /* Mobile Submenu */
        .mobile-submenu {
          max-height: 0;
          overflow: hidden;
          background-color: #f8f9fa;
          transition: max-height 0.3s ease;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-submenu.active {
          max-height: 1000px;
        }

        .mobile-submenu-item {
          border-bottom: 1px solid #e9ecef;
        }

        .mobile-submenu-item:last-child {
          border-bottom: none;
        }

        .mobile-submenu-link-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-submenu-link {
          flex: 1;
          padding: 12px 20px 12px 40px;
          color: #555;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: block;
        }

        .mobile-submenu-link:hover {
          color: #007bff;
          background-color: #fff;
          padding-left: 45px;
        }

        /* Mobile Third Menu */
        .mobile-third-menu {
          max-height: 0;
          overflow: hidden;
          background-color: #f0f0f0;
          transition: max-height 0.3s ease;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-third-menu.active {
          max-height: 500px;
        }

        .mobile-third-menu-item {
          border-bottom: 1px solid #e0e0e0;
        }

        .mobile-third-menu-item:last-child {
          border-bottom: none;
        }

        .mobile-third-menu-link {
          padding: 10px 20px 10px 60px;
          color: #666;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.3s ease;
          display: block;
        }

        .mobile-third-menu-link:hover {
          color: #007bff;
          background-color: #fff;
          padding-left: 65px;
        }

        /* Mobile Menu Footer */
        .mobile-menu-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          background-color: #f8f9fa;
        }

        .mobile-auth-buttons {
          margin-bottom: 20px;
        }

        .mobile-auth-btn {
          width: 100%;
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .mobile-auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .mobile-user-profile {
          display: flex;
          justify-content: center;
        }

        /* Mobile Social Links */
        .mobile-social-links {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .mobile-social-link {
          width: 40px;
          height: 40px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .mobile-social-link:hover {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
          transform: translateY(-3px);
        }

        /* Prevent body scroll when menu is open */
        body.mobile-menu-open {
          overflow: hidden !important;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .mobile-menu-container {
            width: 280px;
          }
          
          .mobile-menu-link {
            font-size: 14px;
          }
          
          .mobile-submenu-link {
            font-size: 13px;
          }
          
          .mobile-third-menu-link {
            font-size: 12px;
          }
        }

        /* Animation for menu items */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-menu-overlay.active .mobile-menu-item {
          animation: slideIn 0.3s ease forwards;
        }

        .mobile-menu-overlay.active .mobile-menu-item:nth-child(1) {
          animation-delay: 0.05s;
        }

        .mobile-menu-overlay.active .mobile-menu-item:nth-child(2) {
          animation-delay: 0.1s;
        }

        .mobile-menu-overlay.active .mobile-menu-item:nth-child(3) {
          animation-delay: 0.15s;
        }

        .mobile-menu-overlay.active .mobile-menu-item:nth-child(4) {
          animation-delay: 0.2s;
        }

        .mobile-menu-overlay.active .mobile-menu-item:nth-child(5) {
          animation-delay: 0.25s;
        }
      `}</style>
    </>
  );
};

export default HeaderOne;