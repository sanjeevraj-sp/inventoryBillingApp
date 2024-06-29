import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";

import { validateEditBrandForm } from "../../utils/formValidation";

const ModelForm = (props) => {
  const { data, show, handleClose , handleSubmit } = props;
  const [formData, setFormData] = useState({});
  const [errors,setErrors] = useState({});

  useEffect(() => {
    setFormData(data);
  },[data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
  };

   const validateModelForm = () => {
    const validationErrors = validateEditBrandForm({brandName : formData.brandName});
    if (validationErrors) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      setFormData({});
      handleSubmit(formData); 
   }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Brand
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBrandName">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control
              type="text"
              name="brandName"
              value={formData?.brandName || ""}
              onChange={handleChange}
              className="custom-input"
            />
            {errors.brandName && (
              <Form.Text className="text-danger">{errors.brandName}</Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => validateModelForm()}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelForm;
