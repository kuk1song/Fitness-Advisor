
export const AuthService = {
    register: (userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
    },
    login: (email, password) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.email === email && user.password === password) {
        localStorage.setItem("isAuthenticated", "true");
        return true;
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem("isAuthenticated");
    },
    isAuthenticated: () => {
      return localStorage.getItem("isAuthenticated") === "true";
    },
  };