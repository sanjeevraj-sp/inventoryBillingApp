import React, { useState } from "react";
import { Offcanvas, Button, Form, InputGroup } from "react-bootstrap";
import { useEffect } from "react";
import { validateAddProductForm } from "../../utils/formValidation";
import { validateEditProductForm } from "../../utils/formValidation";
import "../../stylesheets/addProductForm.css";
import { useSelector } from "react-redux";
import { http, host } from "../../utils/httpServices";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import imageUtils from "../../utils/imageServices.js";

const AddProduct = (props) => {
  const navigate = useNavigate();
  const { brand, productData, show, handleClose, handleSubmit } = props;
  const isAddingProduct = Object.keys(productData).length === 0;
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;
  const token = userStore.token;

  useEffect(() => {
    if (Object.keys(productData).length > 0) {
      setFormData(productData);
    } else {
      setFormData({});
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let data;
    var validationErrors = {};
    if (isAddingProduct) {
      validationErrors = validateAddProductForm(formData);
    } else {
      validationErrors = validateEditProductForm(formData);
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      if (isAddingProduct) {
        formData.brandId = brand._id;
      }
      if (!isAddingProduct) {
        try {
          data = new FormData();
          data = { ...formData };
          delete data.productImage;
          const result = await http.put(
            `${host}/inventory/updateProduct`,
            data,
            token
          );
          toast.success("Product updated successfully");
          handleClose();
          window.location.reload();
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Error in updating product"
          );
        }
      } else {
        try {
          const file = formData.productImage;
          const blob = await imageUtils.getFileAsBlob(file);
          const base64Image = await imageUtils.convertBase64(blob);
          formData.productImage = base64Image;
          const data = new FormData();
          for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
              data.append(key, formData[key]);
            }
          }
          const result = await http.post(
            `${host}/inventory/addProduct`,
            data,
            token
          );
          toast.success("Product added successfully");
          handleClose();
          window.location.reload();
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Error in adding product"
          );
        }
      }
    }
  };

  return (
    <>
      <Toaster />
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "35rem" }}
      >
        <Offcanvas.Header closeButton className="offcanvasheader">
          <Offcanvas.Title>
            {isAddingProduct ? "Add Product" : "Edit Product"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={`addProductForm-${theme}`}>
          <Form onSubmit={handleFormSubmit}>
            {isAddingProduct && (
              <Form.Group className="mb-3" controlId="productImage">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  name="productImage"
                  onChange={handleChange}
                />
                {errors.productImage && (
                  <Form.Text className="text-danger">
                    {errors.productImage}
                  </Form.Text>
                )}
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName || ""}
                onChange={handleChange}
                placeholder="Enter product name"
              />
              {errors.productName && (
                <Form.Text className="text-danger">
                  {errors.productName}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                placeholder="Enter category"
              />
              {errors.category && (
                <Form.Text className="text-danger">{errors.category}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="brandId">
              <Form.Label>Brand ID</Form.Label>
              <Form.Control
                type="text"
                name="brandId"
                value={brand?._id}
                readOnly
                placeholder=""
              />
              {errors.brandId && (
                <Form.Text className="text-danger">{errors.brandId}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="purchasePrice">
              <Form.Label>Purchase Price</Form.Label>
              <Form.Control
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice || ""}
                min={0}
                onChange={handleChange}
                placeholder="Enter purchase price"
              />
              {errors.purchasePrice && (
                <Form.Text className="text-danger">
                  {errors.purchasePrice}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="retailPrice">
              <Form.Label>Retail Price</Form.Label>
              <Form.Control
                type="number"
                name="retailPrice"
                value={formData.retailPrice || ""}
                onChange={handleChange}
                placeholder="Enter retail price"
              />
              {errors.retailPrice && (
                <Form.Text className="text-danger">
                  {errors.retailPrice}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="offerPer">
              <Form.Label>Offer Percentage</Form.Label>
              <Form.Control
                type="number"
                name="offerPer"
                value={formData.offerPer || ""}
                onChange={handleChange}
                placeholder="Enter offer percentage"
              />
              {errors.offerPer && (
                <Form.Text className="text-danger">{errors.offerPer}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="threshold">
              <Form.Label>Threshold</Form.Label>
              <Form.Control
                type="number"
                name="threshold"
                value={formData.threshold || ""}
                onChange={handleChange}
                placeholder="Enter threshold"
              />
              {errors.threshold && (
                <Form.Text className="text-danger">
                  {errors.threshold}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock || ""}
                onChange={handleChange}
                placeholder="Enter stock"
              />
              {errors.stock && (
                <Form.Text className="text-danger">{errors.stock}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Enter description"
              />
              {errors.description && (
                <Form.Text className="text-danger">
                  {errors.description}
                </Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleFormSubmit}>
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AddProduct;
