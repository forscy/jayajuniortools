import Cookies from 'js-cookie';



// remove token from cookie
export const removeToken = () => {
  Cookies.remove('token');
};