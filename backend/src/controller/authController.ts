import user from "../model/userModel.js"
import jwt from 'jsonwebtoken'



const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (email: any, userId: any) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}


export const verifyjwt = async (req, res) => {
    try {
        if (req.cookies.jwt) {
            res.send(true)
        } else {
            res.send(false)
        }
    } catch (error) {
        console.log(error);
    }
}



export const login = async (req: { body: any }, res: any) => {
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
                createdAt: new Date() 
            },
            { 
                new: true, 
                upsert: true
            }
        );
        const token = createToken(email, userDetails.id);
        res.cookie('jwt', token, {
            maxAge, 
            sameSite: 'None',
            secure: true,
        });

        return res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
};




