import express from "express";

const app = express();
app.use(express.json());

const articleInfo = [
  {
    name: "learn-node",
    upvotes: 0,
    comments: [],
  },
  {
    name: "learn-react",
    upvotes: 0,
    comments: [],
  },
  {
    name: "mongodb",
    upvotes: 0,
    comments: [],
  },
];

app.post("/api/articles/:name/upvote", (req, res) => {
  const article = articleInfo.find((a) => a.name === req.params.name);
  article.upvotes += 1;

  res.json(article);
});

app.post("/api/articles/:name/comments", (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  console.log(req.body, "sdbfdshbf");

  const article = articleInfo.find((a) => a.name === name);

  article.comments.push({
    postedBy,
    text,
  });

  res.json(article);
});

// app.get("/hello", function (req, res) {
//   res.send("HELLO! from get");
// });

// app.get("/hello/:name", function (req, res) {
//   res.send("HELLO! " + req.params.name + "");
// });

// app.post("/hello", function (req, res) {
//   res.send("Hello " + req.body.name + " from post!");
// });

app.listen(8000, () => {
  console.log("server is listening on port 8000");
});
