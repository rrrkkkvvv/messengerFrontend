import { localStorageItems } from "../values/strValues";

const getTokenFromLS = (): string | null => {
  const storedToken = localStorage.getItem(localStorageItems.jwtToken);

  if (storedToken) {
    try {
      return storedToken;
    } catch (error) {
      console.error("Error parsing token from LS:", error);
      return null;
    }
  } else {
    return null;
  }
};
export default getTokenFromLS;
