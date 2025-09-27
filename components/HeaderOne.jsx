import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/legacy/image";

// If you have real menu data, import it. For now we mirror the caller's shape
// import MenuData from "../../data/menu/HeaderMenu.json";
const fallbackMenu = [
  { label: "Home", path: "/" },
  {
    label: "Products",
    path: "/products",
    submenu: [
      { sublabel: "Overview", subpath: "/products" },
      {
        sublabel: "Categories",
        subpath: "/products/categories",
        thirdmenu: [
          { tlabel: "Phones", tpath: "/products/categories/phones" },
          { tlabel: "Laptops", tpath: "/products/categories/laptops" },
        ],
      },
      { sublabel: "Pricing", subpath: "/pricing" },
    ],
  },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function useScrollLock(locked) {
  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    if (locked) {
      htmlElement.classList.add("main-menu-opened");
      bodyElement.style.overflow = "hidden";
    } else {
      htmlElement.classList.remove("main-menu-opened");
      bodyElement.style.overflow = "auto";
    }
    return () => {
      htmlElement.classList.remove("main-menu-opened");
      bodyElement.style.overflow = "auto";
    };
  }, [locked]);
}

const HeaderOne = ({ menu = fallbackMenu }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Track open states for dropdowns by a stable key
  const [openKeys, setOpenKeys] = useState(() => new Set());

  const navRef = useRef(null);
  const togglerRef = useRef(null);

  useScrollLock(mobileOpen);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  // Close on outside click when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const handleOutside = (e) => {
      if (!navRef.current) return;
      const isClickInsideNav = navRef.current.contains(e.target);
      const isClickOnToggler = togglerRef.current?.contains(e.target);
      if (!isClickInsideNav && !isClickOnToggler) {
        closeMobile();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") closeMobile();
    };

    document.addEventListener("click", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  // Utility to build unique keys for nested menu items
  const getKey = (parts) => parts.filter(Boolean).join("/");

  const isOpen = (key) => openKeys.has(key);
  const setOpen = (key, value) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (value) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const toggleOpenExclusiveAtLevel = (levelPrefix, key) => {
    setOpenKeys((prev) => {
      const next = new Set();
      // Keep keys not at this level
      prev.forEach((k) => {
        if (!k.startsWith(levelPrefix)) next.add(k);
      });
      // Toggle the target key
      if (!prev.has(key)) next.add(key);
      return next;
    });
  };

  const onTopItemToggle = (idx, hasSubmenu) => (e) => {
    if (!hasSubmenu) return; // allow default navigation
    e.preventDefault();
    const levelPrefix = `lvl1:`;
    const key = `lvl1:${idx}`;
    toggleOpenExclusiveAtLevel(levelPrefix, key);
  };

  const onSecondItemToggle = (pIdx, idx, hasThird) => (e) => {
    if (!hasThird) return; // allow default navigation
    e.preventDefault();
    const levelPrefix = `lvl2:${pIdx}:`;
    const key = `lvl2:${pIdx}:${idx}`;
    toggleOpenExclusiveAtLevel(levelPrefix, key);
  };

  // Keyboard support: toggle with Enter/Space
  const onKeyToggle = (handler) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handler(e);
    }
  };

  const navClasses = useMemo(() => {
    const base = "main-nav-wrapper";
    return mobileOpen ? `${base} is-open` : base;
  }, [mobileOpen]);

  return (
    <>
      <header className="page-header">
        <nav className="navbar navbar__style-three" aria-label="Main">
          <div className="container-fluid p-l-md-80 p-r-md-80">
            <div className="navbar-inner">
              <div className="brand-logo-container">
                <Link href="/" legacyBehavior>
                  <a aria-label="Go to homepage">
                    <Image src="/images/kwithus.png" alt="brand-logo" width={120} height={40} priority />
                  </a>
                </Link>
              </div>

              <div className={navClasses} ref={navRef}>
                <ul className="main-navigation list-inline" role="menubar">
                  {menu.map((item, i) => {
                    const hasSubmenu = Boolean(item.submenu?.length);
                    const key = `lvl1:${i}`;
                    const expanded = isOpen(key);
                    return (
                      <li className={hasSubmenu ? "has-dropdown" : undefined} key={i} role="none">
                        <Link href={item.path} legacyBehavior>
                          <a
                            role="menuitem"
                            aria-haspopup={hasSubmenu || undefined}
                            aria-expanded={hasSubmenu ? expanded : undefined}
                            onClick={onTopItemToggle(i, hasSubmenu)}
                            onKeyDown={onKeyToggle(onTopItemToggle(i, hasSubmenu))}
                            tabIndex={0}
                          >
                            {item.label}
                          </a>
                        </Link>
                        {hasSubmenu && (
                          <ul className={`submenu ${expanded ? "opened" : ""}`} role="menu">
                            {item.submenu.map((sub, j) => {
                              const hasThird = Boolean(sub.thirdmenu?.length);
                              const subKey = `lvl2:${i}:${j}`;
                              const subExpanded = isOpen(subKey);
                              return hasThird ? (
                                <li className="has-dropdown" key={j} role="none">
                                  <Link href={sub.subpath} legacyBehavior>
                                    <a
                                      role="menuitem"
                                      aria-haspopup
                                      aria-expanded={subExpanded}
                                      onClick={onSecondItemToggle(i, j, true)}
                                      onKeyDown={onKeyToggle(onSecondItemToggle(i, j, true))}
                                      tabIndex={0}
                                    >
                                      {sub.sublabel}
                                    </a>
                                  </Link>
                                  <ul className={`submenu ${subExpanded ? "opened" : ""}`} role="menu">
                                    {sub.thirdmenu.map((t, k) => (
                                      <li key={k} role="none">
                                        <Link href={t.tpath} legacyBehavior>
                                          <a role="menuitem" tabIndex={0}>{t.tlabel}</a>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ) : (
                                <li key={j} role="none">
                                  <Link href={sub.subpath} legacyBehavior>
                                    <a role="menuitem" tabIndex={0}>{sub.sublabel}</a>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="navbar-extra-features ml-auto">
                <form
                  action="#"
                  className={`navbar-search ${searchOpen ? "show-nav-search" : ""}`}
                >
                  <div className="search-field">
                    <input type="text" className="navbar-search-field" placeholder="Search Here..." />
                    <button className="navbar-search-btn" type="button" aria-label="Search">
                      <i className="fal fa-search" />
                    </button>
                  </div>
                  <span className="navbar-search-close" onClick={() => setSearchOpen(false)} role="button" tabIndex={0}>
                    <i className="fal fa-times" />
                  </span>
                </form>

                <button
                  className="nav-search-field-toggler m-l-xs-10 m-l-md-30 mr-0"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                >
                  <i className="far fa-search" />
                </button>
              </div>

              <button
                className={`main-nav-toggler d-block d-lg-none ${mobileOpen ? "expanded" : ""}`}
                onClick={toggleMobile}
                aria-label="Toggle navigation menu"
                aria-controls="primary-navigation"
                aria-expanded={mobileOpen}
                ref={togglerRef}
              >
                <span className="toggler-inner">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default HeaderOne;

