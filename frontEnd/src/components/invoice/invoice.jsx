import InvoiceForm from "./invoiceForm";
import { useSelector } from "react-redux";
import { Image } from "react-bootstrap";

import "../../stylesheets/invoice.css";
import invoiceIcon from "../../images/invoiceIcon.png";
const Invoice = () => {
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;

  return (
    <div className={`invoice-${theme}`}>
      <div
        className={`invoicePageHeader-${theme} d-flex align-items-center justify-content-center`}
      >
        <Image
          src={invoiceIcon}
          style={{
            height: "2.2rem",
            width: "2.2rem",
          }}
          className="mb-3 mt-3"
        />
        <h3>Invoice</h3>
      </div>
      <InvoiceForm></InvoiceForm>
    </div>
  );
};

export default Invoice;
