import axios from "axios";

export const URL=import.meta.env.VITE_URL


export const getQuizQuestions = async (user: unknown) => {
    let response = await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/user-login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return response
  };
  