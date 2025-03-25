import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./cred.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

let db;

async function connectToDB() {
  const uri = !process.env.MONGODB_USERNAME ? "mongodb://127.0.0.1:27017" : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@blog-site-cluster.u1awy.mongodb.net/?retryWrites=true&w=majority&appName=blog-site-cluster`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();

  db = client.db("blog-site-db");
}

app.use(express.static(path.join(__dirname, '../dist/index.html')))

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const article = await db.collection("article").findOne({ name });

  res.json(article);
});

// adding this here on (app.use) bcoz need to check in all the endpoint except app.get endpoint
app.use(async function (req, res, next) {
  const { authtoken } = req.headers;

  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken);
    req.user = user;

    next();
  } else {
    res.sendStatus(400);
  }
});

// Upvote end point
app.post("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  console.log(req.user, "reqa daata");
  

  const article = await db.collection("article").findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const canUpVote = uid && !upvoteIds.includes(uid);

  if (canUpVote) {
    const updatedArticleWithUpvotes = await db
      .collection("article")
      .findOneAndUpdate(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        },
        {
          returnDocument: "after",
        }
      );

    res.json(updatedArticleWithUpvotes);
  } else {
    res.sendStatus(403);
  }
});

// comments end point
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const newComment = { postedBy, text };

  const updatedArticleWithComment = await db
    .collection("article")
    .findOneAndUpdate(
      { name },
      {
        $push: { comments: newComment },
      },
      {
        returnDocument: "after",
      }
    );

  res.json(updatedArticleWithComment);
});

const PORT = process.env.PORT || 8000;

async function start() {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
}

start();
