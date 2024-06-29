import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "react-bootstrap";
import { Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

import stockIcon from "../../images/stockIcon.png";
import "../../stylesheets/stock.css";
import { http, host } from "../../utils/httpServices";
import LowStockProductCard from "./lowStockPrdCard";

const Stock = () => {
  const [products, setProducts] = useState({});
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
      <Toaster />
      <div className={`stock-${theme}`}>
        <div
          className={`stockPageHeader-${theme} d-flex align-items-center justify-content-center`}
        >
          <Image
            src={stockIcon}
            style={{
              height: "2.2rem",
              width: "2.2rem",
            }}
            className="mb-1 mt-3"
          />
          <h3>Stock</h3>
        </div>
        <div>
          <h6 className={` d-flex justify-content-center`}>
            Product stocks below threshold
          </h6>
        </div>
        <br />
        <div className={`container product-cards`}>
          {products.length > 0 ? (
            <Row xs={2} md={5} className="g-5">
              {products.map((product) => (
                <LowStockProductCard product={product} />
              ))}
            </Row>
          ) : (
            <h5
              className={`d-flex align-items-center justify-content-center nolowStock-${theme}`}
            >
              No Products are below threshold
            </h5>
          )}
        </div>
      </div>
    </>
  );
};

export default Stock;
