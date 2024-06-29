import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { http , host } from "../../utils/httpServices";

import "../../stylesheets/lowStkReport.css"
import lowStockPdfGenerator from "./pdfGenerator/lowstockpdfgenarator";


const LowStockReport = () => {
  const [products, setProducts] = useState([]);
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;

  const fetchLowStockProduct = async () => {
    try {
      const result = await http.get(
        `${host}/inventory/getLowStockProducts`,
        {},
        token
      );
      const lowStockProducts = result.data.products;
      setProducts(lowStockProducts);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Sorry, Cannot fetch data"
      );
    }
  };

  useEffect(() => {
    fetchLowStockProduct();
  }, []);

  return (
    <>
    <Toaster/>
     <div className={`container lowStockProducts-${theme}`}>
      {products.length > 0 ? (
       <>
         <div className={`tableContainer-${theme}`}>
          <table className={`table-${theme}`}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Threshold</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.threshold}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`pdfGenaratorBtn`}>
           <Button className="primary"  onClick={() => lowStockPdfGenerator(products)}>Generate Report</Button> 
        </div>
       </>
      ) : (
        <h5
          className={`d-flex align-items-center justify-content-center nolowStock-${theme}`}
        >
          No Products are below threshold
        </h5>
      )}
    </div>
    </>
   
  );
};

export default LowStockReport;
