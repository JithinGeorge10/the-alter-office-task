
export const addTask = async (req, res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};




