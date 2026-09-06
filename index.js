const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config()


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();



        const database = client.db("hireloop_db");
        const jobCollection = database.collection("jobs");
        const companyCollection = database.collection("companies");


        app.get('/api/jobs', async (req, res) => {
            const query = {};
            if(req.query.companyId) {
                query.companyId = req.query.companyId;
            }
            const cursor = jobCollection.find(query);
            const results = await cursor.toArray();
            res.send(results);

        })


        app.post('/api/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job);
            res.send(result);
        });



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged deployment. You successfully connected to MongoDB!");
    } finally {

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
















// const express = require('express');
// import { MongoClient } from 'mongodb';
// require('dotenv').config()


// const app = express()
// const port = 5000;



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })





// const client = new MongoClient(process.env.MONGO_DB_URI);

// export async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log("You successfully connected to MongoDB!");
//     return client;
//   } catch (err) {
//     console.dir(err);
//   }
// }



// // Call this only when your application terminates
// export async function disconnectFromMongoDB() {
// //   await client.close();
// }





// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
