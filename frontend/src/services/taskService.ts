import axios from "axios";


export const addTask = async (taskName: string, text: string, date: string, status: string, category: string,userId:String) => {
    try {
       const response= await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/add-task`, {userId:userId,taskName:taskName,description:text,date:date,status:status,category:category}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response
    } catch (error) {
        console.log(error);
    }
};


export const fetchTasks = async (userId: string) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_AUTH_SERVICE_URL}/fetch-task`,
            {
                params: { userId }, 
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );
        console.log(response.data); 

        return response.data
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};
