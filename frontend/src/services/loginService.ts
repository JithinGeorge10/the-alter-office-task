import axios from "axios";
export const getQuizQuestions = async (user: unknown) => {
  let response = await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/user-login`, user, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return response
};


export const verifyJwt = async () => {
  let response = await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/verify-jwt`,{}, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return response
};
