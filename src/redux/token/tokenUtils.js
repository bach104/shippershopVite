export const checkTokenExpiration = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return true;
    }
  };
  export const getTokenExpiration = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; 
    } catch (err) {
      console.error('Error getting token expiration:', err);
      return null;
    }
  };