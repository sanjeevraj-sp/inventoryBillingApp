import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../stylesheets/brandCard.css";
import editIcon from "../../images/editIcon.png";
import deleteIcon from "../../images/deleteIcon.png";

const BrandCard = (props) => {
  const { brand, handleEdtBtn, handleDlt , handleNavigateToProductPage } = props;
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;

  const showProductsPage = (brand) => {
    handleNavigateToProductPage(brand);
  };

  return (
    <Col key={brand._id}>
      <Card
        className={`custom-card-${theme}`}
        style={{ width: "13rem", height: "15.5rem" }}
      >
        <Card.Body>
          <div
            onClick={() => showProductsPage(brand)}
            className="d-flex flex-column align-items-center"
          >
            <Image
              src={brand.brandImage} 
              style={{ height: "6.2rem", width: "6.2rem" , borderRadius : "20px" }}
              className="mb-3 mt-3"
              alt={`${brand.brandName}_image`}
            />

            <div className="mt-3 d-flex flex-column align-items-center">
              <Card.Title>{brand.brandName}</Card.Title>
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
              onClick={(e) => handleEdtBtn(brand)}
            />
            <div style={{ marginLeft: "15px" }}>
              <Image
                src={deleteIcon}
                style={{ height: "1.5em", width: "1.5em", cursor: "pointer" }}
                onClick={() => handleDlt(brand)}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BrandCard;
