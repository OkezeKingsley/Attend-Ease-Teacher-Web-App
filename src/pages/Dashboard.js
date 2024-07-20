import Sidebar from "../components/Sidebar";
import '../styles/Dashboard.css'
import Parent from "../views/Parent";

function Dashboard() {
  return (
    <div className="dashboard-container">
        <Sidebar/>
        <Parent />
    </div>
  );
}

export default Dashboard;