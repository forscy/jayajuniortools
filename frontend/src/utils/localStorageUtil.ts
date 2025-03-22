

// CRUD Token
export const getTokenInLocalStorage = () => {
  return localStorage.getItem('token');
};

export const setTokenInLocalStorage = (token: string) => {
  localStorage.setItem('token', token);
}

export const removeTokenInLocalStorage = () => {
  localStorage.removeItem('token');
}