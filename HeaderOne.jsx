import React, { useState, useRef, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Link from "next/link";
import Image from "next/legacy/image";
import MenuData from "../../data/menu/HeaderMenu.json";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

const HeaderOne = () => {
  // Main Menu Toggle
  const menuRef = useRef();
  const mobileMenuRef = useRef();
  const [showForm, setShowForm] = useState(false);
  
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
          // If no submenu, let the link work normally
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

  // Mobile Menu Toggle - Enhanced
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const MobileMenuToggler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    setIsAnimating(true);
    const newToggleState = !mobileToggle;
    setMobileToggle(newToggleState);
    
    const HtmlTag = document.querySelector("html");
    const body = document.querySelector("body");
    
    if (newToggleState) {
      HtmlTag.classList.add("main-menu-opened");
      body.style.overflow = "hidden";
      // Add backdrop
      const backdrop = document.createElement("div");
      backdrop.className = "mobile-menu-backdrop";
      backdrop.onclick = () => closeMobileMenu();
      document.body.appendChild(backdrop);
      
      // Trigger animation
      setTimeout(() => {
        backdrop.classList.add("show");
      }, 10);
    } else {
      closeMobileMenu();
    }
    
    // Reset animation flag
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const closeMobileMenu = () => {
    const HtmlTag = document.querySelector("html");
    const body = document.querySelector("body");
    const backdrop = document.querySelector(".mobile-menu-backdrop");
    
    HtmlTag.classList.remove("main-menu-opened");
    body.style.overflow = "auto";
    
    if (backdrop) {
      backdrop.classList.remove("show");
      setTimeout(() => {
        backdrop.remove();
      }, 300);
    }
    
    setMobileToggle(false);
  };

  // Enhanced mobile menu dropdown handling
  const handleMobileDropdown = (e, hasSubmenu) => {
    if (!hasSubmenu) return;
    
    e.preventDefault();
    const listItem = e.currentTarget.closest('li');
    const isActive = listItem.classList.contains('active');
    
    // Close all other dropdowns
    const allDropdowns = mobileMenuRef.current?.querySelectorAll('.has-dropdown');
    allDropdowns?.forEach(dropdown => {
      if (dropdown !== listItem) {
        dropdown.classList.remove('active');
        const submenu = dropdown.querySelector('.submenu');
        if (submenu) submenu.style.maxHeight = '0px';
      }
    });
    
    // Toggle current dropdown
    if (isActive) {
      listItem.classList.remove('active');
      const submenu = listItem.querySelector('.submenu');
      if (submenu) submenu.style.maxHeight = '0px';
    } else {
      listItem.classList.add('active');
      const submenu = listItem.querySelector('.submenu');
      if (submenu) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
      }
    }
  };

  // Close mobile menu when clicking outside or on non-dropdown items
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && mobileToggle) {
        closeMobileMenu();
      }
    };

    if (mobileToggle) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [mobileToggle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const backdrop = document.querySelector(".mobile-menu-backdrop");
      if (backdrop) backdrop.remove();
      
      const body = document.querySelector("body");
      if (body) body.style.overflow = "auto";
      
      const HtmlTag = document.querySelector("html");
      if (HtmlTag) HtmlTag.classList.remove("main-menu-opened");
    };
  }, []);

  return (
    <>
      <header className="page-header">
        <nav className="navbar navbar__style-three">
          <div className="container-fluid p-l-md-80 p-r-md-80">
            <div className="navbar-inner">
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
              <div className="main-nav-wrapper desktop-menu">
                <ul className="main-navigation list-inline" ref={menuRef}>
                  {MenuData.map((data, index) =>
                    data.submenu ? (
                      <li className="has-dropdown" key={index}>
                        <Link href={data.path} legacyBehavior>
                          <a>{data.label}</a>
                        </Link>
                        <ul className="submenu">
                          {data.submenu.map((subData, subIndex) =>
                            subData.thirdmenu ? (
                              <li className="has-dropdown" key={subIndex}>
                                <Link href={subData.subpath} legacyBehavior>
                                  <a>{subData.sublabel}</a>
                                </Link>
                                <ul className="submenu">
                                  {subData.thirdmenu.map((thirdData, thirdIndex) => (
                                    <li key={thirdIndex}>
                                      <Link href={thirdData.tpath} legacyBehavior>
                                        <a>{thirdData.tlabel}</a>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ) : (
                              <li key={subIndex}>
                                <Link href={subData.subpath} legacyBehavior>
                                  <a>{subData.sublabel}</a>
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

              {/* Mobile Menu */}
              <div className={`mobile-nav-wrapper ${mobileToggle ? 'show' : ''}`} ref={mobileMenuRef}>
                <div className="mobile-nav-header">
                  <div className="mobile-logo">
                    <Link href="/" legacyBehavior>
                      <a onClick={closeMobileMenu}>
                        <Image
                          src="/images/kwithus.png"
                          alt="brand-logo"
                          width={100}
                          height={33}
                        />
                      </a>
                    </Link>
                  </div>
                  <button 
                    className="mobile-nav-close"
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                  >
                    <i className="fal fa-times"></i>
                  </button>
                </div>
                
                <div className="mobile-nav-content">
                  <ul className="mobile-navigation">
                    {MenuData.map((data, index) =>
                      data.submenu ? (
                        <li className="has-dropdown" key={index}>
                          <a 
                            href="#"
                            onClick={(e) => handleMobileDropdown(e, true)}
                            className="dropdown-toggle"
                          >
                            {data.label}
                            <i className="fas fa-chevron-down dropdown-icon"></i>
                          </a>
                          <ul className="submenu">
                            {data.submenu.map((subData, subIndex) =>
                              subData.thirdmenu ? (
                                <li className="has-dropdown" key={subIndex}>
                                  <a 
                                    href="#"
                                    onClick={(e) => handleMobileDropdown(e, true)}
                                    className="dropdown-toggle"
                                  >
                                    {subData.sublabel}
                                    <i className="fas fa-chevron-down dropdown-icon"></i>
                                  </a>
                                  <ul className="submenu">
                                    {subData.thirdmenu.map((thirdData, thirdIndex) => (
                                      <li key={thirdIndex}>
                                        <Link href={thirdData.tpath} legacyBehavior>
                                          <a onClick={closeMobileMenu}>{thirdData.tlabel}</a>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ) : (
                                <li key={subIndex}>
                                  <Link href={subData.subpath} legacyBehavior>
                                    <a onClick={closeMobileMenu}>{subData.sublabel}</a>
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                      ) : (
                        <li key={index}>
                          <Link href={data.path} legacyBehavior>
                            <a onClick={closeMobileMenu}>{data.label}</a>
                          </Link>
                        </li>
                      )
                    )}
                  </ul>

                  {/* Mobile Auth Buttons */}
                  <div className="mobile-auth-section">
                    <SignedOut>
                      <SignInButton>
                        <button className="btn btn-primary mobile-auth-btn">
                          로그인 / 가입
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <div className="mobile-user-section">
                        <UserButton />
                      </div>
                    </SignedIn>
                  </div>
                </div>
              </div>

              <div className="navbar-extra-features ml-auto">
                {/* Desktop Auth buttons */}
                <div className="auth-buttons desktop-only">
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

                {/* Language dropdown (hidden for now) */}
                <Dropdown className="lang-dropdown m-l-xs-10 m-l-md-30 desktop-only">
                  {/* Toggle and Menu can be opened if needed */}
                </Dropdown>

                {/* Search form */}
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
                  className="nav-search-field-toggler m-l-xs-10 m-l-md-30 mr-0 desktop-only"
                  onClick={headerSearchShow}
                >
                  <i className="far fa-search" />
                </button>
              </div>

              {/* Enhanced Mobile Hamburger Toggle */}
              <button
                className={`main-nav-toggler d-block d-lg-none ${
                  mobileToggle ? "expanded" : ""
                } ${isAnimating ? "animating" : ""}`}
                onClick={MobileMenuToggler}
                aria-label={mobileToggle ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={mobileToggle}
              >
                <div className="toggler-inner">
                  <span className="bar bar-1" />
                  <span className="bar bar-2" />
                  <span className="bar bar-3" />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <style jsx>{`
        /* Mobile Menu Backdrop */
        .mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }
        
        .mobile-menu-backdrop.show {
          opacity: 1;
        }

        /* Desktop Menu - Hide on Mobile */
        .desktop-menu {
          display: block;
        }
        
        @media (max-width: 991.98px) {
          .desktop-menu {
            display: none;
          }
          .desktop-only {
            display: none !important;
          }
        }

        /* Mobile Navigation Wrapper */
        .mobile-nav-wrapper {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          max-width: 85vw;
          height: 100vh;
          background: #ffffff;
          z-index: 1000;
          transition: right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          display: none;
        }

        @media (max-width: 991.98px) {
          .mobile-nav-wrapper {
            display: block;
          }
        }

        .mobile-nav-wrapper.show {
          right: 0;
        }

        /* Mobile Nav Header */
        .mobile-nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .mobile-nav-close {
          background: none;
          border: none;
          font-size: 20px;
          color: #333;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .mobile-nav-close:hover {
          background-color: #e9ecef;
        }

        /* Mobile Nav Content */
        .mobile-nav-content {
          padding: 20px 0;
        }

        .mobile-navigation {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-navigation li {
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-navigation li:last-child {
          border-bottom: none;
        }

        .mobile-navigation a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .mobile-navigation a:hover {
          background-color: #f8f9fa;
          color: #007bff;
          text-decoration: none;
        }

        /* Mobile Dropdown Styles */
        .mobile-navigation .has-dropdown > a .dropdown-icon {
          transition: transform 0.2s ease;
          font-size: 12px;
        }

        .mobile-navigation .has-dropdown.active > a .dropdown-icon {
          transform: rotate(180deg);
        }

        .mobile-navigation .submenu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background-color: #f8f9fa;
        }

        .mobile-navigation .submenu a {
          padding: 12px 20px 12px 40px;
          font-weight: 400;
          font-size: 14px;
        }

        .mobile-navigation .submenu .submenu a {
          padding-left: 60px;
        }

        /* Mobile Auth Section */
        .mobile-auth-section {
          padding: 20px;
          border-top: 1px solid #eee;
          margin-top: 20px;
        }

        .mobile-auth-btn {
          width: 100%;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 500;
        }

        .mobile-user-section {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Enhanced Hamburger Animation */
        .main-nav-toggler {
          background: none;
          border: none;
          padding: 10px;
          cursor: pointer;
          z-index: 1001;
          position: relative;
        }

        .toggler-inner {
          width: 24px;
          height: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .toggler-inner .bar {
          height: 2px;
          background-color: #333;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center;
        }

        .main-nav-toggler.expanded .bar-1 {
          transform: translateY(8px) rotate(45deg);
        }

        .main-nav-toggler.expanded .bar-2 {
          opacity: 0;
          transform: scaleX(0);
        }

        .main-nav-toggler.expanded .bar-3 {
          transform: translateY(-8px) rotate(-45deg);
        }

        .main-nav-toggler.animating .toggler-inner .bar {
          transition-duration: 0.3s;
        }

        /* Responsive adjustments */
        @media (max-width: 575.98px) {
          .mobile-nav-wrapper {
            width: 280px;
          }
        }

        /* Smooth scrolling for mobile menu */
        .mobile-nav-wrapper {
          scrollbar-width: thin;
          scrollbar-color: #ccc transparent;
        }

        .mobile-nav-wrapper::-webkit-scrollbar {
          width: 4px;
        }

        .mobile-nav-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-nav-wrapper::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 2px;
        }

        /* Focus styles for accessibility */
        .main-nav-toggler:focus,
        .mobile-nav-close:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        .mobile-navigation a:focus {
          outline: 2px solid #007bff;
          outline-offset: -2px;
        }
      `}</style>
    </>
  );
};

export default HeaderOne;