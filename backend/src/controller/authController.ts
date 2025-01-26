import user from "../model/userModel"
import jwt from 'jsonwebtoken'



const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (email: any, userId: any) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const login = async (req, res) => {
    try {
        const { email, displayName, photoURL } = req.body;

        if (!email) {
            return res.status(400).send('Email is required');
        }

        const userDetails = await user.findOneAndUpdate(
            { email },
            {
                email,
                displayName,
                photoURL,
                createdAt: new Date(),
            },
            {
                new: true,
                upsert: true, 
            }
        );

        const token = createToken(email, userDetails.id);

        res.cookie('jwt', token, {
            httpOnly: false, 
            domain: 'task-management-pi-three.vercel.app',
            maxAge,
            sameSite: 'none',
            secure: true, 
            path: '/',

        });

        return res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};




