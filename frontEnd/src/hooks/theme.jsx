import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "../redux/slices/user.jsx";

export const useSwitchTheme = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const switchedThemes = {
    light: "dark",
    dark: "light",
  };

  return async () => {
    const userTheme = user.theme;
    const newTheme = switchedThemes[userTheme]; 
    dispatch(switchTheme({ theme: newTheme })); 
  };
};
