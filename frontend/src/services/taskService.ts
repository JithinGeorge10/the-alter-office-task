import axios from "axios";


export const addTask = async (taskName: string, text: string, date: string, status: string, category: string) => {
    try {
        await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/add-task`, {taskName:taskName,description:text,date:date,status:status,category:category}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

    } catch (error) {
        console.log(error);
    }
};
