import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { http, host } from "../../utils/httpServices";

import "../../stylesheets/salesAndProfitReport.css";
import generateMonthlyReportPDF from "./pdfGenerator/salesAndProfitpdfgenerator";

const SalesAndProfitReport = () => {
  const [sales, setSales] = useState({});

  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;

  const fetchSalesReport = async () => {
    try {
      const result = await http.get(
        `${host}/invoice/monthlySalesAndProfitReport`,
        {},
        token
      );
      setSales(result.data.monthlyReport);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Sorry, Cannot fetch data"
      );
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  return (
    <>
      <Toaster />
      <div className={`container lowStockProducts-${theme}`}>
        {Object.keys(sales).length > 0 ? (
          <>
            <div className={`tableContainer-${theme}`}>
              <table className={`table-${theme}`}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Total Sales</th>
                    <th>Total Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sales).map(([year, monthsData]) =>
                    Object.entries(monthsData).map(([month, data]) => (
                      <tr key={`${year}-${month}`}>
                        <td>{year}</td>
                        <td>{month}</td>
                        <td>{data.totalSales}</td>
                        <td>{data.totalProfit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className={`pdfGenaratorBtn`}>
              <Button
                className="primary"
                onClick={() =>
                  generateMonthlyReportPDF(sales)
                }
              >
                Generate Report
              </Button>
            </div>
          </>
        ) : (
          <h5
            className={`d-flex align-items-center justify-content-center nolowStock-${theme}`}
          >
            No Data
          </h5>
        )}
      </div>
    </>
  );
};

export default SalesAndProfitReport;
