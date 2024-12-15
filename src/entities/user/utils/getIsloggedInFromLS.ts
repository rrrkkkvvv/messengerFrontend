import { localStorageItems } from "../../../shared/values/strValues";

const getIsLoggedInLS = (): boolean => {
  // Could be "loggedIn" or ""
  const isLoggedIn = localStorage.getItem(localStorageItems.isLoggedIn);

  if (isLoggedIn && isLoggedIn === "loggedIn") {
    return true;
  } else {
    return false;
  }
};
export default getIsLoggedInLS;
