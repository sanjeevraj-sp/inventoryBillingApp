import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBrands } from "../../redux/slices/brands";
import toast, { Toaster } from "react-hot-toast";
import useLogout from "../../hooks/logout";
import { Row, Col } from "react-bootstrap";
import { Image } from "react-bootstrap";

import BrandCard from "./BrandCard";
import { deleteBrand } from "../../redux/slices/brands";
import { updateBrand } from "../../redux/slices/brands";
import addBrandIcon from "../../images/brandAddIcon.png";
import { Card } from "react-bootstrap";
import ModelForm from "./modelForm";
import "../../stylesheets/brands.css";
import AddBrand from "./addBrand";
import { addBrand } from "../../redux/slices/brands";
import brandsIcon from "../../images/brandsIcon.png"
import { http, host } from "../../utils/httpServices";

const Brands = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = useLogout();
  
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;
  const brandStore = useSelector((state) => state.brand);
  const brands = brandStore.brandData;
  // const [allBrands, setAllBrands] = useState(brands);
  const [editBrand, setEditBrand] = useState();
  const [showModel, setShowModel] = useState(false);
  const handleCloseModel = () => {
    setShowModel(false);
  };
  const handleShowModel = () => setShowModel(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };

  const fetchBrands = async () => {
    try {
      const result = await http.get(
        `${host}/inventory/getAllBrands`,
        {},
        token
      );
      dispatch(setBrands({ brands: result.data.brands }));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching brands"
      );
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrandBtn = () => {
    handleShowOffcanvas();
  };

  const handleEditBrandBtn = (brand) => {
    setEditBrand(brand);
    handleShowModel();
  };

  const handleAddBrandFormData = async (formData) => {
    handleCloseOffcanvas();
    try {
      const result = await http.post( `${host}/inventory/addBrand`, formData , token);
      dispatch(addBrand({ newBrand: result.data }));
      toast.success("Brand added successfully");
    } catch (error) {
      toast.error("Error in adding Brand!");
      console.log(error);
    }
  };

  const handleEditBrand = async (formData) => {
    try {
      handleCloseModel();
      const data = {
        _id: formData._id,
        updatedName: formData.brandName,
      };
      const result = await http.put(
        `${host}/inventory/updateBrand`,
        data,
        token
      );
      dispatch(updateBrand({ updatedBrand: result.data.updatedBrand }));
      setEditBrand({});
      toast.success("Brand updated successfully");
    } catch (error) {
      toast.error(
        "Error Editing brand"
      );
    }
  };

  const handleDeleteBrand = async (brand) => {
    try {
      const result = await http.delete(
        `${host}/inventory/deleteBrand?_id=${brand._id}`,
        token
      );
      dispatch(deleteBrand({ delBrandId: result.data._id }));
      window.location.reload();
      toast.success(result.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error deleting brand"
      );
    }
  };

  const navigateToProductPage = (brand) => {
    navigate("/products" ,  {state : { brand : brand }})
  };

  return (
    <>
      <Toaster />
      <div className={`container pt-4 pb-5 brands-${theme}`}>
        <div className={`brandPageHeader-${theme} d-flex align-items-center justify-content-center`}>
          <Image
            src={brandsIcon}
            style={{
              height: "2.2rem",
              width: "2.2rem",
            }}
            className="mb-3 mt-3"
            alt={`Add Brand`}
          />
          <h3>Brands</h3>
        </div>
        {brands.length > 0 ? (
          <Row xs={2} md={5} className="g-5">
            {brands.map((brand) => (
              <BrandCard
                brand={brand}
                handleEdtBtn={handleEditBrandBtn}
                handleDlt={handleDeleteBrand}
                handleNavigateToProductPage={navigateToProductPage}
              />
            ))}

            <Col key={1}>
              <Card
                className={`addBrand-card-${theme}`}
                style={{ width: "13rem", height: "15.5rem" }}
                onClick={() => handleAddBrandBtn()}
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
          <Col key={1}>
          <Card
            className={`addBrand-card-${theme}`}
            style={{ width: "13rem", height: "15.5rem" }}
            onClick={() => handleAddBrandBtn()}
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
        )}
      </div>

      <AddBrand
        show={showOffcanvas}
        handleClose={handleCloseOffcanvas}
        handleSubmit={handleAddBrandFormData}
      />

      <ModelForm
        data={editBrand}
        show={showModel}
        handleClose={handleCloseModel}
        handleSubmit={handleEditBrand}
      ></ModelForm>
    </>
  );
};

export default Brands;
