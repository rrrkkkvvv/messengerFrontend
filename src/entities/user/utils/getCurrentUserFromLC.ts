import { localStorageItems } from "../../../shared/values/strValues";
import { TUserInfo } from "../api/userTypes";

const getCurrentUserFromLS = (): TUserInfo | null => {
  const storedUser = localStorage.getItem(localStorageItems.currentUser);

  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing currentUser from LC:", error);
      return null;
    }
  } else {
    return null;
  }
};
export default getCurrentUserFromLS;
