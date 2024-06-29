import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../stylesheets/lowStockPrdCard.css";

const LowStockProductCard = ({product}) => {
    const userStore = useSelector((state) => state.user);
    const theme = userStore.theme;

    return ( 
        <Col key={product._id}>
        <Card
          className={`container custom-card-${theme}`}
          style={{ width: "13rem", height: "16.5rem" }}
        >
          <Card.Body>
            <div
              className="d-flex flex-column align-items-center"
            >
              <Image
                src={product.productImage} 
                style={{ height: "6.2rem", width: "6.2rem" , borderRadius : "20px" }}
                className="mb-3 mt-3"
                alt={`${product.productName}_image`}
              />
  
              <div className="mt-3 d-flex flex-column align-items-center">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text className="">{`Stock : ${product.stock}`}</Card.Text>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
}
 
export default LowStockProductCard;