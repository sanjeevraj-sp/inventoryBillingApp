import { useSelector } from "react-redux";

import Brands from "./Brands";
import "../../stylesheets/inventory.css";

const Inventory = () => {
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
