import React from "react";
import { useSelector } from "react-redux";
import { Image } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import "bootstrap/dist/css/bootstrap.min.css";
import reportIcon from "../../images/reportIcon.png";
import "../../stylesheets/report.css";
import TodaysOrderReport from "./todaysOrdReport";
import LowStockReport from "./lowStkReport";
import SalesAndProfitReport from "./salesAndProfitReport";

const Reports = () => {
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;

  return (
    <div className={`report-${theme}`}>
      <div
        className={`reportPageHeader-${theme} d-flex align-items-center justify-content-center`}
      >
        <Image
          src={reportIcon}
          style={{
            height: "3rem",
            width: "3rem",
          }}
          className="mb-3 mt-3"
        />
        <h3>Reports</h3>
      </div>

      <div className="reportList">
        <Tabs
          defaultActiveKey="todaysOrderReport"
          justify
        >
          <Tab eventKey="todaysOrderReport" title="Todays Order Report">
            <TodaysOrderReport/>
          </Tab>
          <Tab eventKey="lowStockReport" title="Low Stock Report">
            <LowStockReport/>
          </Tab>
          <Tab eventKey="analyticsReport" title="Sales And Analysis Report">
           <SalesAndProfitReport/>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
