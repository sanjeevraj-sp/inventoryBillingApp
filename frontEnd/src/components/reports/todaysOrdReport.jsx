import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { http , host } from "../../utils/httpServices";

import "../../stylesheets/todaysOrdReport.css"
import todaysOrderPdfGenerator from "./pdfGenerator/todaysOrderpdfgenerator";

const TodaysOrderReport = () => {
  const [orders, setOrders] = useState([]);
  const [totalSales,setTotalSales] = useState();
  const [totalProfit,setTotalProfit] = useState();

  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;

  const fetchTodaysOrder = async () => {
    try {
      const result = await http.get(
        `${host}/invoice/orderReport`,
        {},
        token
      );
      const orderData = result.data.orderData;
      setOrders(orderData);
      setTotalSales(result.data.totalSales)
      setTotalProfit(result.data.totalProfit)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Sorry, Cannot fetch data"
      );
    }
  };

  useEffect(() => {
    fetchTodaysOrder();
  }, []);

  return (
    <>
    <Toaster/>
     <div className={`container lowStockProducts-${theme}`}>
      {orders.length > 0 ? (
       <>
         <div className={`tableContainer-${theme}`}>
          <table className={`table-${theme}`}>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Client Contact</th>
                <th>Net Total</th>
                <th>Order Profit</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order,index) => (
                <tr key={index}>
                  <td>{order.clientName}</td>
                  <td>{order.clientContact}</td>
                  <td>{order.netTotal}</td>
                  <td>{order.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={`salesData-${theme}`}>
            <p> Total Sales : {totalSales}</p>
            <p> Total Profit : {totalProfit}</p>
          </div>
        </div>
        <div className={`pdfGenaratorBtn`}>
           <Button className="primary"  onClick={() => todaysOrderPdfGenerator(orders , totalSales , totalProfit)}>Generate Report</Button> 
        </div>
       </>
      ) : (
        <h5
          className={`d-flex align-items-center justify-content-center nolowStock-${theme}`}
        >
          No Orders Today
        </h5>
      )}
    </div>
    </>
  );
};

export default TodaysOrderReport;
