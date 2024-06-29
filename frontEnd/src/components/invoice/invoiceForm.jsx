import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

import "../../stylesheets/invoiceForm.css";
import { http, host } from "../../utils/httpServices";
import useLogout from "../../hooks/logout";
import { validateOrderForm } from "../../utils/formValidation.js"
import billPdfGenerator from "./billGenerator.jsx";

const InvoiceForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [netTotal, setNetTotal] = useState(0);
  const [selectedRowIndex, setSelecetedRowIndex] = useState();

  const userStore = useSelector((state) => state.user);
  const token = userStore.token;
  const theme = userStore.theme;

  useEffect(() => {
    getInvoiceProducts();
  }, []);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getInvoiceProducts = async () => {
    try {
      const result = await http.get(
        `${host}/inventory/getProductsForInvoice`,
        {},
        token
      );
      const invoiceProducts = result.data.products.map((product) => ({
        id: product._id,
        productName: product.productName,
        offerPer: product.offerPer,
        retailPrice: product.retailPrice,
        purchasePrice: product.purchasePrice,
        stock : product.stock
      }));
      setProducts(invoiceProducts);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Sorry, Cannot create invoice"
      );
    }
  };

  const handleSearchChange = (e, index) => {
    const query = e.target.value.trim();
    setSelecetedRowIndex(index);
    handleSearch(query);
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredProducts(products);
    } else {
      const regex = new RegExp(query, "i"); // 'i' flag for case-insensitive search
      const results = products.filter((product) =>
        regex.test(product.productName)
      );
      setFilteredProducts(results);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        productName: "",
        offerPer: "",
        retailPrice: "",
        quantity: 1,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  const handleChangeList = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    setFilteredProducts([]);
  };

  const calculateTotal = (offerPer, retailPrice, quantity) => {
    const total = (1 - offerPer / 100) * retailPrice * quantity;
    return isNaN(total) ? "" : total.toFixed(2);
  };

  useEffect(() => {
    calculateNetTotal();
  }, [rows]);

  const calculateNetTotal = () => {
    var netTotal = 0;
    for (let i = 0; i < rows.length; i++) {
      netTotal += parseInt(rows[i].total);
    }
    setNetTotal(netTotal);
  };

  const handleOrder = async () => {
    try {
        var totalPurchasePrice = 0;
        const products = rows.map(row => {
            const { stock, ...productData } = row; 
            totalPurchasePrice += ( productData.quantity * productData.purchasePrice)
            return productData
        });
        formData.products = products;
        formData.netTotal = netTotal;
        formData.profit = netTotal - totalPurchasePrice;
        const validationErrors = validateOrderForm(formData);
        if (validationErrors) {
            toast('Invalid Data')
        }
        const response = await http.post(`${host}/invoice/addOrder`, formData, token);
        if (response && response.data) {
            const orderData = response.data.order; 
            billPdfGenerator(orderData);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
        }
    } catch (error) {
        toast.error()
    }
};


  return (
    <>
      <Toaster />
      <Form>
        <table>
          <tbody>
            <tr>
              <td>
                <Form.Group className="mb-3" controlId="clientName">
                  <Form.Label>Client Name : </Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName"
                    onChange={handleChange}
                    className="custom-input-field"
                  />
                  {errors.clientName && (
                    <Form.Text className="text-danger">
                      {errors.clientName}
                    </Form.Text>
                  )}
                </Form.Group>
              </td>
              <td>
                <Form.Group className="mb-3" controlId="clientContact">
                  <Form.Label>Client Contact : </Form.Label>
                  <Form.Control
                    type="number"
                    name="clientContact"
                    onChange={handleChange}
                    className="custom-input-field"
                  />
                  {errors.clientContact && (
                    <Form.Text className="text-danger">
                      {errors.clientContact}
                    </Form.Text>
                  )}
                </Form.Group>
              </td>
              <td rowSpan="2">
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="clientAddress"
                    rows={3}
                    onChange={handleChange}
                    className="custom-input-field"
                  />
                  {errors.clientAddress && (
                    <Form.Text className="text-danger">
                      {errors.clientAddress}
                    </Form.Text>
                  )}
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Group className="mb-3" controlId="clientEmail">
                  <Form.Label>Client Email : </Form.Label>
                  <Form.Control
                    type="email"
                    name="clientEmail"
                    onChange={handleChange}
                    className="custom-input-field"
                  />
                  {errors.clientEmail && (
                    <Form.Text className="text-danger">
                      {errors.clientEmail}
                    </Form.Text>
                  )}
                </Form.Group>
              </td>
              <td>
                <Form.Group className="mb-3" controlId="orderDate">
                  <Form.Label>Order Date : </Form.Label>
                  <Form.Control
                    type="date"
                    name="orderDate"
                    value={null}
                    onChange={handleChange}
                    className="custom-input-field"
                  />
                  {errors.orderDate && (
                    <Form.Text className="text-danger">
                      {errors.orderDate}
                    </Form.Text>
                  )}
                </Form.Group>
              </td>
            </tr>
          </tbody>
        </table>
        <br></br>

        <Table className="order-table">
          <thead>
            <tr>
              <th className={`col-pn-${theme}`}>Product Name</th>
              <th className={`col-qn-${theme}`}>Quantity</th>
              <th className={`col-op-${theme}`}>Offer Percentage</th>
              <th className={`col-rp-${theme}`}>Retail Price</th>
              <th className={`col-tt-${theme}`}>Total</th>
              <th className={`col-dl-${theme}`}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <Form.Group controlId="productName">
                    <Form.Control
                      type="text"
                      name="productName"
                      value={row?.productName || null}
                      onChange={(e) => handleSearchChange(e, index)}
                      className="custom-input"
                    />

                    {index === selectedRowIndex &&
                      filteredProducts.map((product) => (
                        <option
                          key={product.id}
                          value={product.productName}
                          onClick={(e) => {
                            handleChangeList(
                              index,
                              "productName",
                              e.target.value
                            );
                            const selectedProduct = products.find(
                              (product) =>
                                product.productName === e.target.value
                            );
                            handleChangeList(
                              index,
                              "id",
                              selectedProduct.id
                            );
                            handleChangeList(
                              index,
                              "stock",
                              selectedProduct.stock
                            );
                            handleChangeList(
                              index,
                              "offerPer",
                              selectedProduct.offerPer
                            );
                            handleChangeList(
                              index,
                              "retailPrice",
                              selectedProduct.retailPrice
                            );
                            handleChangeList(
                              index,
                              "purchasePrice",
                              selectedProduct.purchasePrice
                            );
                          }}
                        >
                          {product.productName}
                        </option>
                      ))}
                  </Form.Group>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.quantity}
                 
                    onChange={(e) =>
                      handleChangeList(index, "quantity", e.target.value)
                    }
                    min={1} 
                    max={row.stock} 
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.offerPercentage}
                    onChange={(e) =>
                      handleChangeList(index, "offerPer", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.retailPrice}
                    onChange={(e) =>
                      handleChangeList(index, "retailPrice", e.target.value)
                    }
                  />
                </td>
                <td>
                  {
                    (row.total = calculateTotal(
                      row.offerPer,
                      row.retailPrice,
                      row.quantity
                    ))
                  }
                </td>

                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteRow(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            <br></br>
            {netTotal > 0 && (
              <tr>
                <td colSpan="5">Net Total:</td>
                <td>{netTotal}</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Button variant="primary" onClick={handleAddRow} className="addRow">
          Add Row
        </Button>
      </Form>
      <div className="orderPlacementBtn">
        <Button variant="info" onClick={handleOrder}>
          Place Order
        </Button>
      </div>
    </>
  );
};

export default InvoiceForm;
