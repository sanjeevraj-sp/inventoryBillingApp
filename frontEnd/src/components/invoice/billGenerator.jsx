import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const billPdfGenerator = (orderData) => {
  const doc = new jsPDF();

  // Extract order data
  const { clientName, clientEmail, clientContact, clientAddress, orderDate, netTotal, products } = orderData;

  // Prepare table columns and rows
  const tableColumn = ["Product Name", "Quantity", "Offer Percentage", "Purchase Price", "Total"];
  const tableRows = products.map(product => [
    product.productName,
    product.quantity,
    product.offerPer,
    product.purchasePrice,
    product.total
  ]);

  // Set the startY position for the table
  let startY = 20;

  // Add client details
  doc.text(`Client Name: ${clientName}`, 14, startY);
  startY += 10;
  doc.text(`Client Email: ${clientEmail}`, 14, startY);
  startY += 10;
  doc.text(`Client Contact: ${clientContact}`, 14, startY);
  startY += 10;
  doc.text(`Client Address: ${clientAddress}`, 14, startY);
  startY += 10;

  // Add order details
  doc.text(`Order Date: ${orderDate}`, 14, startY);
  startY += 10;
  doc.text(`Net Total: ${netTotal}`, 14, startY);
  startY += 10;

  // Add table
  doc.autoTable(tableColumn, tableRows, { startY });

  // Directly print the PDF
  doc.autoPrint();

  // Output the PDF as a blob
  const blob = doc.output("blob");

  // Create a new URL object
  const url = URL.createObjectURL(blob);

  // Create a new window with the PDF
  window.open(url, "_blank");
};

export default billPdfGenerator;
