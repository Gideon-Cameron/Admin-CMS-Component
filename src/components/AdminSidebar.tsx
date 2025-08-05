import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaLaptopCode,
  FaQuoteRight,
  FaUserFriends,
  FaChevronLeft,
} from "react-icons/fa";

const navItems = [
  { to: "/admin", icon: <FaHome />, label: "Dashboard" },
  { to: "/admin/experience", icon: <FaTools />, label: "Experience" },
  { to: "/admin/projects", icon: <FaLaptopCode />, label: "Projects" },
  { to: "/admin/testimonials", icon: <FaQuoteRight />, label: "Testimonials" },
  { to: "/admin/social", icon: <FaUserFriends />, label: "Social Links" },
];

const AdminSidebar = () => {
  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-full w-16 bg-[#0a192f] border-r border-[#112240] flex-col items-center py-6 z-50 space-y-8">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) =>
            `text-[#8892b0] hover:text-[#64ffda] text-xl transition ${
              isActive ? "text-[#64ffda]" : ""
            }`
          }
          title={item.label}
        >
          {item.icon}
        </NavLink>
      ))}

      <div className="flex-grow" />
      <FaChevronLeft className="text-[#112240] text-xs" />
    </aside>
  );
};

export default AdminSidebar;
