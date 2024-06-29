import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import editIcon from "../../images/editIcon.png";
import deleteIcon from "../../images/deleteIcon.png";
import Modal from "react-bootstrap/Modal";

import "../../stylesheets/productCard.css";

const ProductCard = (props) => {
  const { product, handleEdtBtn, handleDlt } = props;
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const [show, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Col key={product._id}>
        <Card
          className={`custom-card-${theme}`}
          style={{ width: "13rem", height: "15.2rem" }}
        >
          <Card.Body>
            <div
              className="d-flex flex-column align-items-center"
              onClick={handleShow}
            >
              <Image
                src={product.productImage}
                style={{
                  height: "6.2rem",
                  width: "6.2rem",
                  borderRadius: "20px",
                }}
                className="mb-3 mt-3"
                alt={`${product.productName}_image`}
              />

              <div className="mt-3 d-flex flex-column align-items-center">
                <Card.Title>{product.productName}</Card.Title>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                marginTop: "10px",
              }}
            >
              <Image
                src={editIcon}
                style={{ height: "23px", width: "23px", cursor: "pointer" }}
                onClick={(e) => handleEdtBtn(product)}
              />
              <div style={{ marginLeft: "15px" }}>
                <Image
                  src={deleteIcon}
                  style={{ height: "1.5em", width: "1.5em", cursor: "pointer" }}
                  onClick={() => handleDlt(product)}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={show} centered>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>{product.productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={product.productImage}
            style={{ height: "6rem", width: "6rem" }}
            className='mb-3 mt-3'
          />
          <p>Product Name : {product.productName}</p>
          <p>Description : {product.description}</p>
          <p>Pruchase Price : {product.purchasePrice}</p>
          <p>Retail Price : {product.retailPrice}</p>
          <p>Offer : {product.offerPer} </p>
          <p>Threshold : {product.threshold} </p>
          <p>Stock : {product.stock} </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductCard;
