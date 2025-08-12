import mongoose, { version } from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.SERVER_PORT;
const bank = process.env.BANK1;

const serverSchema = mongoose.Schema({
    cardNumber: {type: String, required: true},
    pin: {type:String, required: true},
    name: {type: String, required: true},
    balance: {type: Number, required: true}
});
const Account = mongoose.model('accounts', serverSchema);

const corsOptions = {
    origin: `http://localhost:${port}`,
    methods: `GET, HEAD, PUT, POST, PATCH, DELETE`,
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

const mongo_url = process.env.SERVER_MONGODB_URL;

mongoose.connect(mongo_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
.then(()=>{
    console.log("Connected To mongodb");
})
.catch(err => {
    console.log("Error while connecting to mongodb, Error: ", err);
});



app.get('/', (req, res) =>{
    res.status(200).json({
        message: "Server API is live.",
        version: "1.0.0",
        endpoints: {
            "GET /" : 'Health check.',
            "GET /server/accounts/?card/?pin": "Get account status"
        }
    });
});

app.get(`/server/${bank}/:card/:pin`, async (req, res) => {
    try{
        const {card, pin} = req.params;
        const account = await Account.findOne({cardNumber: card, pin: pin })

        if(!account)
        {
            return res.status(404).json({error: "Invalid card or pin."});
        }
        return res.status(200).json({
            success: true,
            account: account
        });
    }
    catch(err){
        console.log("Internal server error ", err);
        return res.status(500).json({
            success: false,
            error: err
        });

    };
});

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
    console.log(`Mongoose version ${version}`);

})