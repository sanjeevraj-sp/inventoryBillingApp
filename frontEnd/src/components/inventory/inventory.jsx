import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Brands from "./Brands";
import "../../stylesheets/inventory.css";

const Inventory = ({ fetchBrands }) => {
  const userStore = useSelector((state) => state.user);
  const theme = userStore.theme;

  return (
    <>
      {/* <Toaster /> */}
      <div className={`inventory-${theme}`}>
        <Brands />
      </div>
    </>
  );
};

export default Inventory;
