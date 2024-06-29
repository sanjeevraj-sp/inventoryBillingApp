import { Route, Routes } from 'react-router-dom';
import DashBoard from '../components/general/dashBoard';
import LogIn from '../components/general/login';
import SignIn from '../components/general/signup';
import Inventory from '../components/inventory/inventory';
import Invoice from '../components/invoice/invoice';
import Report from '../components/reports/reports';
import Stock from '../components/stock/stock';
import Products from '../components/inventory/products';
import TodaysOrderReport from '../components/reports/todaysOrdReport';
import LowStockReport from '../components/reports/lowStkReport';
import AnalyticsReport from '../components/reports/salesAndProfitReport';

const AppRoutes = ({ sidebarToggle }) => {
  return (
    <Routes>
      <Route path="/*" element={<DashBoard sidebarToggle={sidebarToggle} />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/inventory" element={<Inventory sidebarToggle={sidebarToggle} />} />
      <Route path="/invoice" element={<Invoice sidebarToggle={sidebarToggle} />} />
      <Route path="/reports" element={<Report sidebarToggle={sidebarToggle} />} />
      <Route path="/stock" element={<Stock sidebarToggle={sidebarToggle} />} />
      <Route path="/products" element={<Products/>} />
      {/* <Route path="/orderreport" element={<TodaysOrderReport/>}/>
      <Route path="/lowstockreport" element={<LowStockReport/>} />
      <Route path="/analyticsreport" element={<AnalyticsReport/>}/> */}
    </Routes>
  );
};

export default AppRoutes;
