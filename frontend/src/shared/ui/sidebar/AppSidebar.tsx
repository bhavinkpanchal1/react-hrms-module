import { Link } from "react-router-dom";

function AppSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-4">
      <h2 className="mb-8 text-xl">HRMS</h2>
      <nav>
        <Link to="/" className="block">
          Dashboard
        </Link>
        <Link to="/employees" className="block">
          Employees
        </Link>
      </nav>
    </aside>
  );
}

export default AppSidebar;
