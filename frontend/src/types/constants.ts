export const BASE_URL = "http://localhost:3003";
// export const BASE_URL = 'http://api-jayajuniortools.forscy.my.id';

export const BASE_API_URL = `${BASE_URL}/api`;
export const BASE_AUTH_URL = `${BASE_API_URL}/auth`;
export const BASE_MOVIE_URL = `${BASE_API_URL}/movies`;

export const HEADERS = {
  "Content-Type": "application/json",
};

export const HEADERS_WITH_CREDENTIALS = {
  "Content-Type": "application/json",
  withCredentials: true,
};

export const HEADERS_WITH_NO_CREDENTIALS = {
  "Content-Type": "application/json",
  withCredentials: false,
};
