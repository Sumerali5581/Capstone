import React from "react";
import * as Icon from "phosphor-react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // cleaner than window.location.href
  };

  const navItems = [
    { to: "/dashboard", icon: <Icon.House size={32} color="#fff" />, text: "Home", bgColor: "#a9c700" },
    { to: "/doctor_about", icon: <Icon.User size={32} color="#fff" />, text: "About", bgColor: "#E9724C" },
    { to: "/doctor_help", icon: <Icon.Phone size={32} color="#fff" />, text: "Contact", bgColor: "#0c68a5" },
    { icon: <Icon.SignOut size={32} color="#fff" />, text: "Logout", bgColor: "#0c68a5", onClick: handleLogout },
  ];

  return (
    <ul className="navbar">
      {navItems.map((item, index) =>
        item.onClick ? (
          <li
            key={index}
            style={{ "--bg-color": item.bgColor }}
            onClick={item.onClick}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.text}</span>
          </li>
        ) : (
          <Link key={index} to={item.to}>
            <li style={{ "--bg-color": item.bgColor }}>
              <span className="icon">{item.icon}</span>
              <span className="text">{item.text}</span>
            </li>
          </Link>
        )
      )}
    </ul>
  );
};

export default Navbar;
