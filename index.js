const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(cors(
  {
    origin: ["https://next-blog-frontend-vert.vercel.app",],
    Credential: true,
    optionSuccessStatus: 200,
  }
));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqpfzla.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const blogCollection = client.db("nextBlogDB").collection("Blog");

    const userCollection = client.db("nextBlogDB").collection("user");

    //create
    app.post("/addBlog", async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    app.get('/addBlog', async(req, res) =>{
        const cursor = blogCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
//  update
    app.get("/addBlog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.send(blog);
    });
    app.put("/addBlog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBlog = req.body;
    
      // Construct the update object using $set
      const updateDoc = {
        $set: {
          name: updatedBlog.name,
          title: updatedBlog.title,
          description: updatedBlog.description,
        },
      };
    
      try {
        // Perform the update operation without upsert if not necessary
        const result = await blogCollection.updateOne(filter, updateDoc);
    
        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Blog updated successfully." });
        } else {
          res.send({ success: false, message: "Blog update failed or no changes were made." });
        }
      } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).send({ error: "An error occurred while updating the blog." });
      }
    });
    
     // delete 
     app.delete('/addBlog/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result =await blogCollection.deleteOne(query)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("NextBlog server is running");
});
app.listen(port, () => {
  console.log(`NextBlog server is running on port:${port}`);
});
