const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config()


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId,  } = require('mongodb');

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
        const usersCollection = database.collection("user");

        app.get('/api/users', async (req, res) => {

            const cursor = usersCollection.find().skip(6);
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/api/jobs', async (req, res) => {
            const query = {};
            if (req.query.companyId) {
                query.companyId = req.query.companyId;
            }
            if (req.query.status) {
                query.status = req.query.status;
            }
            const cursor = jobCollection.find(query);
            const results = await cursor.toArray();
            res.send(results);

        })

        app.get('/api/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await jobCollection.findOne(query);
            res.send(result);
        })


        app.post('/api/jobs', async (req, res) => {
            const job = req.body;
            const newJob = {
                ...job,
                createdAt: new Date()
            }
            const result = await jobCollection.insertOne(newJob);
            res.send(result);
        });


        // company related apis

        app.get('/api/companies', async (req, res) => {
            const cursor = companyCollection.find().skip(8);
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/api/my/companies', async (req, res) => {
            const query = {};
            if (req.query.recruiterId) {
                query.recruiterId = req.query.recruiterId;
            }
            const result = await companyCollection.findOne(query);
            console.log('my company', result);
            res.send(result || {});
        });

        app.post("/api/companies", async (req, res) => {
            const company = req.body;
            const newCompany = {
                ...company,
                createdAt: new Date()
            }
            const result = await companyCollection.insertOne(newCompany);
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






// here is the company information. created in db. note this information for this conversation. i will detail prompt later.


// now give me 30 jobs randomly for these companies. and do not provide _id field for the job: and the signature of a job is below:







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
