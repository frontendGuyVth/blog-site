import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb"

const app = express();
app.use(express.json());

let db;
async function connectToDB() {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })
  await client.connect();

  db = client.db('blog-site-db');
}


app.get('/api/articles/:name', async (req, res) => {
  const {name} = req.params

  const article = await db.collection('article').findOne({name});

  res.json(article);
})

app.post("/api/articles/:name/upvote", async (req, res) => {

  const {name} = req.params

  const updatedArticleWithUpvotes = await db.collection('article').findOneAndUpdate({name}, {
    $inc: {upvotes: 1}
  }, {
    returnDocument: "after"
  })

  res.json(updatedArticleWithUpvotes);

});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const newComment = {postedBy, text}

  const updatedArticleWithComment = await db.collection('article').findOneAndUpdate({name}, {
    $push: {comments: newComment}
  }, {
    returnDocument: "after"
  })

  res.json(updatedArticleWithComment)
 
});

async function start() {
  await connectToDB()
  app.listen(8000, () => {
    console.log("server is listening on port 8000");
  });
}

start();
