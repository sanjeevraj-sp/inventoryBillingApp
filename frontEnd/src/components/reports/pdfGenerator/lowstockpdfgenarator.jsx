import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const lowStockPdfGenerator = products => {
  const doc = new jsPDF();

  const tableColumn = ["Product", "Threshold", "Stock"];
  const tableRows = [];

  products.forEach(product => {
    const productData = [
      product.productName,
      product.threshold,
      product.stock,
    ];
    tableRows.push(productData);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 20 }); // startY is basically margin-top

  // we use a date string to generate our filename.
  const date = Date().split(" ");
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

  // PDF title. and margin-top + margin-left
  doc.text("The Current Low Stock Products List ", 14, 15);

  // Directly print the PDF
  doc.autoPrint();

  // Output the PDF as a blob
  const blob = doc.output("blob");

  // Create a new URL object
  const url = URL.createObjectURL(blob);

  // Create a new window with the PDF
  window.open(url, "_blank");
};

export default lowStockPdfGenerator;
