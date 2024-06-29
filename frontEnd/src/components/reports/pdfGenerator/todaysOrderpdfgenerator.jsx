import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const todaysOrderPdfGenerator = (orders, totalSales, totalProfit) => {
  const doc = new jsPDF();

  const tableColumn = ["Client Name", "Client Contact", "Net Total", "Profit"];
  const tableRows = [];

  orders.forEach(order => {
    const orderData = [
      order.clientName,
      order.clientContact,
      order.netTotal,
      order.profit,
    ];
    tableRows.push(orderData);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 20 }); // startY is basically margin-top

  // Additional information
  doc.text(`Total Sales: ${totalSales}`, 14, doc.autoTable.previous.finalY + 10);
  doc.text(`Total Profit: ${totalProfit}`, 14, doc.autoTable.previous.finalY + 20);

  // PDF title and date
  const today = new Date();
  const dateString = today.toLocaleDateString();
  doc.text(`Today's Orders Report - ${dateString}`, 14, 15);

  // Directly print the PDF
  doc.autoPrint();

  // Output the PDF as a blob
  const blob = doc.output("blob");

  // Create a new URL object
  const url = URL.createObjectURL(blob);

  // Create a new window with the PDF
  window.open(url, "_blank");
};

export default todaysOrderPdfGenerator;
