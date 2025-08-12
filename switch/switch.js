import mongoose , { version } from 'mongoose';
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.SWITCH_PORT;
const mongo_url = process.env.SWITCH_MONGODB_URL;

console.log("Connecting to MongoDB using:", mongo_url);

const corsOption = {
    origin: `http://localhost:${port}`, 
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    allowHeaders: "Content-Type, Authorization",
    credentials: true, 
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


mongoose.connect(mongo_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDb.");
})
.catch(error=>{
    console.error("Error connecting to mongodb", error);
    process.exit(1);
});

const switchSchema = new mongoose.Schema(    {
    bankid: {type: Number, required: true},
    link:{ type: String, required: true}

    
});

const swtch = mongoose.model('banks', switchSchema);


async function getBankAccount(url) {
    try {
        // const res = await fetch(`http://localhost:30     01/server/HBL/:card/:pin`);
        const res = await fetch(url);
        //if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}



app.get("/", (req, res) => {
    res.json({
        message: "Switch API is live",
        version: "1.0.0",
        endpoints: {
            'GET /': 'health check',
            'GET /switch/accounts/:card/:pin': "Check available banks."
        }
    })
});

app.get("/switch/:card/:pin",async (req, res) => {
    try{
        const {card, pin} = req.params;
        const id = card.slice(0, 4)
        console.log(id, `card ${card}`);
        const firstFourDigit = parseInt(id);
        console.log(parseInt(id));

        const bank = await swtch.findOne({bankId: firstFourDigit});
        if(!bank )
        {
            return res.status(404).json({error: "bank is not available"});
        }

        const bankUrl = bank.link+"/"+card+"/"+pin;

        console.log(bankUrl);

        const result = await getBankAccount(bankUrl);
        if(!result)
        {

            return res.status(404).json({error: "No account found"});
        }
        return res.status(200).json({result});

    }
    catch(error)
    {
        console.error("Error while fetching the bank. error ", error);
        res.status(500).json({error: "Internal server error."});
    }

});

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
    console.log(`Mongoose version: ${version}`);
});