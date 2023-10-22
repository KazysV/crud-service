const express = require("express");
const crud = require("./queries");
const PORT = process.env.PORT || 3000;
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public")); // Serve static files from the "public" directory
app.set("views", path.join(__dirname, "public"));


//generating static html file
app.get("/", (req, res) => {
    res.sendFile('public/index.html'); // Serve the HTML file
});
//api handlers
app.get("/groceries", crud.getGroceries);
app.post("/groceries", crud.createGrocery);
app.put("/groceries/:id", crud.updateGrocery);
app.delete("/groceries/:id", crud.deleteGrocery);
//server start
app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}!`);
});
