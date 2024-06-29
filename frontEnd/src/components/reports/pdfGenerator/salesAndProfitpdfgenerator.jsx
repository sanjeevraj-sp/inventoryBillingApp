import jsPDF from "jspdf";
import "jspdf-autotable";

const generateMonthlyReportPDF = (monthlyReport) => {
  const doc = new jsPDF();
  const tableColumns = ["Year", "Month", "Total Sales", "Total Profit"];
  const tableRows = [];

  for (const [year, monthsData] of Object.entries(monthlyReport)) {
    for (const [month, data] of Object.entries(monthsData)) {
      tableRows.push([year, month, data.totalSales, data.totalProfit]);
    }
  }

  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
  });

  doc.output("dataurlnewwindow");
};

export default generateMonthlyReportPDF;
