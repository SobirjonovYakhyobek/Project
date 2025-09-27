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

  // Mobile Menu Toggle
  const [mobileToggle, setMobileToggle] = useState(false);

  const MobileMenuToggler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newToggleState = !mobileToggle;
    setMobileToggle(newToggleState);
    
    const HtmlTag = document.querySelector("html");
    const body = document.querySelector("body");
    
    if (newToggleState) {
      HtmlTag.classList.add("main-menu-opened");
      body.style.overflow = "hidden";
    } else {
      HtmlTag.classList.remove("main-menu-opened");
      body.style.overflow = "auto";
    }
  };

  // Close mobile menu when clicking outside or on non-dropdown items
  useEffect(() => {
    const handleClickOutside = (event) => {
      const HtmlTag = document.querySelector("html");
      const body = document.querySelector("body");
      const menuWrapper = document.querySelector(".main-nav-wrapper");
      const toggler = document.querySelector(".main-nav-toggler");
      
      // Close menu if clicking outside
      if (mobileToggle && menuWrapper && !menuWrapper.contains(event.target) && !toggler?.contains(event.target)) {
        HtmlTag.classList.remove("main-menu-opened");
        body.style.overflow = "auto";
        setMobileToggle(false);
      }
    };

    const handleMenuItemClick = (event) => {
      const HtmlTag = document.querySelector("html");
      const body = document.querySelector("body");
      const clickedItem = event.target.closest("li");
      const clickedLink = event.target.closest("a");
      
      // Close menu if clicking on a direct link (not dropdown)
      if (clickedLink && clickedItem && !clickedItem.classList.contains("has-dropdown")) {
        HtmlTag.classList.remove("main-menu-opened");
        body.style.overflow = "auto";
        setMobileToggle(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && mobileToggle) {
        const HtmlTag = document.querySelector("html");
        const body = document.querySelector("body");
        HtmlTag.classList.remove("main-menu-opened");
        body.style.overflow = "auto";
        setMobileToggle(false);
      }
    };

    if (mobileToggle) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("click", handleMenuItemClick);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleMenuItemClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [mobileToggle]);

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

              <div className="main-nav-wrapper">
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
              
              <div className="navbar-extra-features ml-auto">
                {/* 로그인 / 가입 - Clerk orqali */}
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

                {/* Til tanlov dropdown (hozircha yashirin) */}
                <Dropdown className="lang-dropdown m-l-xs-10 m-l-md-30">
                  {/* Toggle va Menu istasangiz ochishingiz mumkin */}
                </Dropdown>

                {/* Qidiruv formasi */}
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

              {/* Modern Mobile Hamburger Menu */}
              <div
                className={`mobile-menu-toggler ${mobileToggle ? "active" : ""}`}
                onClick={MobileMenuToggler}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    MobileMenuToggler(e);
                  }
                }}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileToggle}
              >
                <div className="hamburger">
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${mobileToggle ? "active" : ""}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <Link href="/" legacyBehavior>
                  <a>
                    <Image
                      src="/images/kwithus.png"
                      alt="brand-logo"
                      width={120}
                      height={40}
                    />
                  </a>
                </Link>
              </div>
              <button
                className="mobile-menu-close"
                onClick={MobileMenuToggler}
                aria-label="Close mobile menu"
              >
                <i className="fal fa-times"></i>
              </button>
            </div>

            <div className="mobile-menu-body">
              <nav className="mobile-navigation">
                <ul className="mobile-menu-list">
                  {MenuData.map((data, index) =>
                    data.submenu ? (
                      <li className="mobile-menu-item has-dropdown" key={index}>
                        <div className="mobile-menu-link-wrapper">
                          <Link href={data.path} legacyBehavior>
                            <a className="mobile-menu-link">{data.label}</a>
                          </Link>
                          <button
                            className="mobile-menu-toggle"
                            onClick={(e) => {
                              e.preventDefault();
                              const parent = e.target.closest(".mobile-menu-item");
                              parent.classList.toggle("active");
                            }}
                            aria-label={`Toggle ${data.label} submenu`}
                          >
                            <i className="fal fa-chevron-down"></i>
                          </button>
                        </div>
                        <ul className="mobile-submenu">
                          {data.submenu.map((subData, subIndex) =>
                            subData.thirdmenu ? (
                              <li className="mobile-submenu-item has-dropdown" key={subIndex}>
                                <div className="mobile-menu-link-wrapper">
                                  <Link href={subData.subpath} legacyBehavior>
                                    <a className="mobile-menu-link">{subData.sublabel}</a>
                                  </Link>
                                  <button
                                    className="mobile-menu-toggle"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const parent = e.target.closest(".mobile-submenu-item");
                                      parent.classList.toggle("active");
                                    }}
                                    aria-label={`Toggle ${subData.sublabel} submenu`}
                                  >
                                    <i className="fal fa-chevron-down"></i>
                                  </button>
                                </div>
                                <ul className="mobile-submenu">
                                  {subData.thirdmenu.map((thirdData, thirdIndex) => (
                                    <li className="mobile-submenu-item" key={thirdIndex}>
                                      <Link href={thirdData.tpath} legacyBehavior>
                                        <a className="mobile-menu-link">{thirdData.tlabel}</a>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ) : (
                              <li className="mobile-submenu-item" key={subIndex}>
                                <Link href={subData.subpath} legacyBehavior>
                                  <a className="mobile-menu-link">{subData.sublabel}</a>
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    ) : (
                      <li className="mobile-menu-item" key={index}>
                        <Link href={data.path} legacyBehavior>
                          <a className="mobile-menu-link">{data.label}</a>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>

              <div className="mobile-menu-footer">
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
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;