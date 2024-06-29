import React from "react";
import { useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import useLogout from "../../hooks/logout";
import { Row, Col } from "react-bootstrap";
import { Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";

import "../../stylesheets/products.css";
import productsIcon from "../../images/productsIcon.png";
import { http, host } from "../../utils/httpServices";
import ProductCard from "./ProductCard";
import addBrandIcon from "../../images/brandAddIcon.png";
import AddProduct from "./addProduct";
import { setBrands } from "../../redux/slices/brands";

const Products = () => {
  const location = useLocation();
  const { brand } = location.state || {};
  
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;

  const [allProducts, setAllProducts] = useState({});
  const [editProduct, setEditProduct] = useState({});
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };

  const fetchProducts = async () => {
    try {
      const result = await http.get(
        `${host}/inventory/getProductsByBrandId?_id=${brand._id}`,
        {},
        token
      );
      setAllProducts(result.data.products);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching brands"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   fetchProducts();
  // }, [allProducts]);

  const fetchProductsByBrand = async (brand) => {
    try {
      const result = await http.get(
        `${host}/inventory/getProductsByBrandId?_id=${brand._id}`,
        {},
        token
      );
      setAllProducts(result.data.products);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching brands"
      );
    }
  };

  const handleAddProductBtn = () => {
    setEditProduct({});
    handleShowOffcanvas();
  };

  const handleEditProductBtn = (product) => {
    setEditProduct(product);
    handleShowOffcanvas();
  };

  const handleDeleteProduct = async (product) => {
    try {
      const result = await http.delete(
        `${host}/inventory/deleteProduct?_id=${product._id}`,
        token
      );
      toast.success(result.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error deleting brand"
      );
    }
  };

  return (
    <>
      <Toaster />
      <div className={`pt-4 pb-5 products-${theme}`}>
        <div
          className={`productPageHeader-${theme} d-flex align-items-center justify-content-center`}
        >
          <Image
            src={productsIcon}
            style={{
              height: "2.7rem",
              width: "2.7rem",
            }}
            className="mb-3 mt-3"
            alt={`Add Brand`}
          />
          <h3>Products</h3>
        </div>
        {allProducts.length > 0 ? (
          <Row xs={2} md={5} className="g-5 productsRow">
            {allProducts.map((product) => (
              <ProductCard
                product={product}
                handleEdtBtn={handleEditProductBtn}
                handleDlt={handleDeleteProduct}
              />
            ))}

            <Col key={1}>
              <Card
                className={`addProduct-card-${theme}`}
                style={{ width: "13rem", height: "15.2rem" }}
                onClick={() => handleAddProductBtn()}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Image
                    src={addBrandIcon}
                    style={{
                      height: "5rem",
                      width: "5rem",
                      borderRadius: "50px",
                    }}
                    className="mb-3 mt-3"
                    alt={`Add Brand`}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Card
            className={`addProduct-card-${theme}`}
            style={{ width: "13rem", height: "16.5rem" }}
            onClick={() => handleAddProductBtn()}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Image
                src={addBrandIcon}
                style={{
                  height: "5rem",
                  width: "5rem",
                  borderRadius: "50px",
                }}
                className="mb-3 mt-3"
                alt={`Add Brand`}
              />
            </Card.Body>
          </Card>
        )}
      </div>

      <AddProduct
        brand={brand}
        productData={editProduct}
        show={showOffcanvas}
        handleClose={handleCloseOffcanvas}
      />

    </>
  );
};

export default Products;
