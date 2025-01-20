import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import cookieParser from 'cookie-parser'
const app = express()
app.use(express.json());


const corsOptions = {
  origin: '', 
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true
};


app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan("dev"));

app.listen(3000, () => {
  console.log(`Server is running on port 3000`)
})