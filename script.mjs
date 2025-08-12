import {MongoClient} from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

const dbname = "bankingSystem";
const banksCollection = "banks";

const bankPort = process.env.SERVER_PORT;
const bankName = process.env.BANK1



    const bank = [{
    bankId: 0,
    link: `http://localhost:${bankPort}/server/${bankName}/`
    }]

    const acc =[{
        cardNumber: '0000009090',
        pin: '1233',
        name: "Ibrahim",
        balance: '9999'

    }]
async function connectToDatabase()
{
    try{
    const db = await client.db(dbname);
    const banks = await db.collection(banksCollection);
    const accounts = await db.collection('accounts');

    // const result = await accounts.insertMany(acc);
    // console.log(result.insertedCount, " sample accounts inserted successfully.");
    // const count = await accounts.countDocuments();
    // console.log(`Total account in the collections `, count );



    const result = await banks.updateOne({ bankId: 0 }, { $set: { link:`http://localhost:${bankPort}/server/${bankName}` } });
    
    console.log(result.insertedCount, " sample accounts inserted successfully.");
    const count = await accounts.countDocuments();
    console.log(`Total account in the collections `, count );
}
catch(error)
{
    console.log("error while creating dataBase ", error);
    
}
finally{
    await client.close();
    console.log("MongoDb connection closed");
}
};

connectToDatabase();