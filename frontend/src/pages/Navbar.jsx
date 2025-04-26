// import React from "react";
// import * as Icon from "phosphor-react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     console.log("token removed");
//     window.location.reload()
//     navigate("/login"); // cleaner than window.location.href
//   };

//   const navItems = [
//     { to: "/dashboard", icon: <Icon.House size={32} color="#fff" />, text: "Home", bgColor: "#a9c700" },
//     { to: "/doctor_about", icon: <Icon.User size={32} color="#fff" />, text: "About", bgColor: "#E9724C" },
//     { to: "/doctor_help", icon: <Icon.Phone size={32} color="#fff" />, text: "Contact", bgColor: "#0c68a5" },
//     { icon: <Icon.SignOut size={32} color="#fff" />, text: "Logout", bgColor: "#0c68a5", onClick: handleLogout },
//   ];

//   return (
//     <ul className="navbar">
//       {navItems.map((item, index) =>
//         item.onClick ? (
//           <li
//             key={index}
//             style={{ "--bg-color": item.bgColor }}
//             onClick={item.onClick}
//           >
//             <span className="icon">{item.icon}</span>
//             <span className="text">{item.text}</span>
//           </li>
//         ) : (
//           <Link key={index} to={item.to}>
//             <li style={{ "--bg-color": item.bgColor }}>
//               <span className="icon">{item.icon}</span>
//               <span className="text">{item.text}</span>
//             </li>
//           </Link>
//         )
//       )}
//     </ul>
//   );
// };

// export default Navbar;


import React from "react";
import * as Icon from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("token removed");
    window.location.reload();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: <Icon.House size={32} />, text: "Home", bgColor: "bg-lime-500" },
    { to: "/about", icon: <Icon.User size={32} />, text: "About", bgColor: "bg-orange-500" },
    { to: "/contact", icon: <Icon.Phone size={32} />, text: "Contact", bgColor: "bg-blue-700" },
    { icon: <Icon.SignOut size={32} />, text: "Logout", bgColor: "bg-red-600", onClick: handleLogout },
  ];

  return (
    <ul className="fixed top-0 left-0 w-full h-13 flex justify-center items-center bg-gray-900 p-3 gap-8 rounded-xl z-50">
      {navItems.map((item, index) =>
        item.onClick ? (
          <li
            key={index}
            onClick={item.onClick}
            className={`relative list-none w-16 h-16 rounded-full cursor-pointer flex flex-col items-center justify-center shadow-md overflow-hidden ${item.bgColor} hover:w-44 transition-all duration-300 ease-in-out`}
          >
            <span className="absolute text-white text-2xl transition-all duration-300 ease-in-out hover:scale-0">{item.icon}</span>
            <span className="absolute text-gray-900 text-lg font-semibold uppercase opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out">{item.text}</span>
          </li>
        ) : (
          <Link key={index} to={item.to}>
            <li
              className={`relative list-none w-16 h-16 rounded-full cursor-pointer flex flex-col items-center justify-center shadow-md overflow-hidden ${item.bgColor} hover:w-44 transition-all duration-300 ease-in-out`}
            >
              <span className="absolute text-white text-2xl transition-all duration-300 ease-in-out hover:scale-0">{item.icon}</span>
              <span className="absolute text-gray-900 text-lg font-semibold uppercase opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out">{item.text}</span>
            </li>
          </Link>
        )
      )}
    </ul>
  );
};

export default Navbar;
