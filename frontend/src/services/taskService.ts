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




export const changeStatus = async (status:any,userId:any) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_AUTH_SERVICE_URL}/change-status`,
            {
                params: { status,userId }, 
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



export const taskDelete = async (taskId:any) => {
    try {
        const response= await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/delete-task`, {taskId:taskId}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};


export const singleUsertask = async (taskId:any) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_AUTH_SERVICE_URL}/singleUser-task`,
            {
                params: { taskId }, 
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

export const editTasks = async (taskName: any, text: string, date: string, status: string, category: string, storedUserId: string, editValue: any) => {
    try {
        const response= await axios.patch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/edit-task`, {userId:storedUserId,taskName:taskName,description:text,date:date,status:status,category:category,taskId:editValue}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log(response)
        return response
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};

export const deleteBatch = async (taskArray: string[]) => {
    try {
        const response= await axios.put(`${import.meta.env.VITE_AUTH_SERVICE_URL}/deleteBatch-task`, {taskArray}, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        console.log(response)
        return response
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};

