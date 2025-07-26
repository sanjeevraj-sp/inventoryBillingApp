import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Chart from "chart.js/auto";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "../../stylesheets/dashBoard.css";
import { http, host } from "../../utils/httpServices";

const DashBoard = () => {
  const [dbData, setDbdata] = useState({});
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;

  const fetchDashBoardData = async () => {
    try {
      const result = await http.get(
        `${host}/dashboard/getDashBoardData`,
        {},
        token
      );
      const data = result.data;
      setDbdata(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Sorry, Cannot fetch data"
      );
    }
  };

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const createLineChart = (ctx, data, color) => {
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const borderColors = color;

    new Chart(ctx, {
      type: "line",
      data: {
        labels: monthNames,
        datasets: [
          {
            label: "",
            data: data,
            borderColor: borderColors,
            tension: 0.2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };

  const createBarChart = (ctx, data) => {
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const barColors = generateRandomColors(data.x.length);
    const borderColors = generateRandomColors(data.x.length);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.x,
        datasets: [
          {
            label: "",
            data: data.y,
            backgroundColor: barColors,
            borderColor: borderColors,
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${randomRGB()}, ${randomRGB()}, ${randomRGB()}, 0.3)`;
      colors.push(color);
    }
    return colors;
  };

  const randomRGB = () => {
    return Math.floor(Math.random() * 256);
  };

  const orderByMonthChart = (data) => {
    const canvas = document.getElementById("orderByMonthChart");
    const ctx = canvas.getContext("2d");

    const monthNumbers = data.map((item) => item._id.month);
    const orderCounts = new Array(12).fill(0);

    data.forEach((item) => {
      const monthIndex = item._id.month - 1;
      orderCounts[monthIndex] = item.orderCount;
    });

    const color = generateRandomColors(orderCounts.length);
    createLineChart(ctx, orderCounts, color);
  };

  const orderByYearChart = (data) => {
    const canvas = document.getElementById("orderByYearChart");
    const ctx = canvas.getContext("2d");

    const yearNumbers = data.map((item) => item._id.year);
    const orderCounts = data.map((item) => item.orderCount);
    const combinedData = yearNumbers.map((year, index) => ({
      year,
      orderCount: orderCounts[index],
    }));
    combinedData.sort((a, b) => a.year - b.year);
    const sortedYearNumbers = combinedData.map((item) => item.year);
    const sortedOrderCounts = combinedData.map((item) => item.orderCount);

    const chartData = {
      x: sortedYearNumbers,
      y: sortedOrderCounts,
    };
    createBarChart(ctx, chartData);
  };

  const salesByMonthChart = (data) => {
    const canvas = document.getElementById("profitByMonthChart");
    const ctx = canvas.getContext("2d");

    const monthNumbers = data.map((item) => item._id.month);
    const salesProfit = new Array(12).fill(0);

    data.forEach((item) => {
      const monthIndex = item._id.month - 1;
      salesProfit[monthIndex] = item.profit;
    });

    const color = generateRandomColors(salesProfit.length);
    createLineChart(ctx, salesProfit, color);
  };

  const salesByYearChart = (data) => {
    const canvas = document.getElementById("profitByYearChart");
    const ctx = canvas.getContext("2d");

    const yearNumbers = data.map((item) => item._id.year);
    const salesProfit = data.map((item) => item.profit);
    const combinedData = yearNumbers.map((year, index) => ({
      year,
      profit: salesProfit[index],
    }));
    combinedData.sort((a, b) => a.year - b.year);
    const sortedYearNumbers = combinedData.map((item) => item.year);
    const sortedSalesProfit = combinedData.map((item) => item.profit);
    const chartData = {
      x: sortedYearNumbers,
      y: sortedSalesProfit,
    };
    createBarChart(ctx, chartData);
  };

  return (
    <>
      <Toaster />
      <div className={`dashBoard-${theme}`}>
        <div className="stats-info">
          <Row xs={1} md={2} className="g-4 dashboard-row">
            <Col
              key={0}
              className="cards-info"
              style={{
                borderBottom: "3.8px solid rgb(56, 151, 246)"
              }}
            >
              <Card className="cards-stats" style={{backgroundColor:"rgba(56, 151, 246, 0.15)"}}>
                <Card.Header className="stat-header" style={{color:"rgb(56, 151, 246)"}}>Today</Card.Header>
                <Card.Body className="cardBody-order-profit">
                  <td className="cardBody-order-profit-column-left">
                    <Card.Title className={`stat-title-${theme}`}>Orders</Card.Title>
                    <Card.Text className={`stat-value-${theme}`}>
                      {dbData.todayOrderCount}
                    </Card.Text>
                  </td>
                  <td className="cardBody-order-profit-column-right">
                    <Card.Title className={`stat-title-${theme}`}>Profit</Card.Title>
                    <Card.Text className={`stat-value-${theme}`}>
                      {dbData.todayProfit}
                    </Card.Text>
                  </td>
                </Card.Body>
              </Card>
            </Col>

            <Col key={1} className="cards-info"  style={{
                borderBottom: "3.8px solid #1cc88a"
              }}>
              <Card style={{backgroundColor:"rgba(28, 200, 138, 0.2)"}}>
                <Card.Header className="stat-header" style={{color:"#1cc88a"}}>This Week</Card.Header>
                <Card.Body className="cardBody-order-profit">
                  <td className="cardBody-order-profit-column-left">
                    <Card.Title className={`stat-title-${theme}`}>Orders</Card.Title>
                    <Card.Text className={`stat-value-${theme}`}>
                      {dbData.weekOrderCount}
                    </Card.Text>
                  </td>
                  <td className="cardBody-order-profit-column-right">
                    <Card.Title className={`stat-title-${theme}`}>Profit</Card.Title>
                    <Card.Text className={`stat-value-${theme}`}>
                      {dbData.weekProfit}
                    </Card.Text>
                  </td>
                </Card.Body>
              </Card>
            </Col>

            <Col key={2} className="cards-info" style={{
                borderBottom: "3.8px solid #36b9cc"
              }}>
              <Card style={{backgroundColor:"rgba(54, 185, 204, 0.14)"}}>
                <Card.Header className="stat-header" style={{color:"#36b9cc"}}>This Month</Card.Header>
                <Card.Body className="cardBody-order-profit">
                  <td className="cardBody-order-profit-column-left">
                    <Card.Title className={`stat-title-${theme}`}>Orders</Card.Title>
                    <Card.Text className={`stat-value-${theme}`}>
                      {dbData.monthOrderCount}
                    </Card.Text>
                  </td>
                  <td className="cardBody-order-profit-column-right">
                    <Card.Title className={`stat-title-${theme}`}>Profit</Card.Title>
                    <Card.Text className={`stat-value-${theme}`}>
                      {dbData.monthProfit}
                    </Card.Text>
                  </td>
                </Card.Body>
              </Card>
            </Col>

            <Col key={3} className="cards-info" style={{
                borderBottom: "3.5px solid #f6c23e"
              }}>
              <Card style={{backgroundColor:"rgb(165,141,86,0.14)"}}>
                <Card.Header className="stat-header" style={{color:"#f6c23e"}}>Low Stock</Card.Header>
                <Card.Body>
                  <Card.Title className={`stat-title-${theme} pb-2`}>Products</Card.Title>
                  <Card.Text className={`stat-value-${theme}`}>
                    {dbData.lowStock}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="stats-chart">
          <div className="order-charts">
            <div className={`order-chart-column-${theme}`}>
              Monthly Orders
              <canvas id="orderByMonthChart">
                {dbData.orderByMonth && orderByMonthChart(dbData.orderByMonth)}
              </canvas>
            </div>

            <div className={`order-chart-column-${theme}`}>
              Yearly Orders
              <canvas id="orderByYearChart">
                {dbData.orderByYear && orderByYearChart(dbData.orderByYear)}
              </canvas>
            </div>
          </div>
          <br></br>
          <div className="profit-charts">
            <div className={`profit-chart-column-${theme}`}>
              Monthly Profit
              <canvas id="profitByMonthChart">
                {dbData.salesByMonth && salesByMonthChart(dbData.salesByMonth)}
              </canvas>
            </div>

            <div className={`profit-chart-column-${theme}`}>
              Yearly Profit
              <canvas id="profitByYearChart">
                {dbData.salesByYear && salesByYearChart(dbData.salesByYear)}
              </canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(DashBoard);
