// Initing db connection   
const {Pool} = require('pg');

const groceriesList = new Pool({
    connectionString: process.env.DATABASE_URL,
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    ssl:{
        rejectUnauthorized: false
    }
})




// Importing groceriesList

const getGroceries = (req,res) => {
    groceriesList.query('SELECT * FROM test_groceries ORDER BY id ASC',(err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).json(result.rows);
    });
}
//querry return all rows from table test_groceries
const getGroceryById = (req,res) => {
    const id = parseInt(req.params.id);
    groceriesList.query('SELECT * FROM test_groceries WHERE id = $1',[id],(err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).json(result.rows);
    })};

//querry to insert new row to table test_groceries
const createGrocery = (req,res) => {
    const {id,name,ammount} = req.body;

    groceriesList.query('INSERT INTO test_groceries (id,name,ammount) VALUES ($1,$2,$3)',[id,name,ammount],(err,result)=>{
        if(err){
            throw err;
        }
        res.status(201).send(`Grocery added with ID: ${result.insertId}`)
    })};

    
//querry to update existing row in table test_groceries by id   
const updateGrocery = (req,res) => { 
    const id = parseInt(req.params.id);
    const {name,ammount} = req.body;


    groceriesList.query('UPDATE test_groceries SET name = $2, ammount = $3 WHERE id = $1',[id,name,ammount],(err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).send(`Grocery modified with ID: ${id}`)
    } )};


//querry to delete row from table test_groceries by id    
const deleteGrocery = (req,res) => {
    const id = parseInt(req.params.id);

    groceriesList.query('DELETE FROM test_groceries WHERE id = $1',[id],(err,result)=>{
        if(err){
            throw err;
        }
        res.status(200).send(`Grocery deleted with ID: ${id}`)
    })};

module.exports = {
    getGroceries,
    getGroceryById,
    createGrocery,
    updateGrocery,
    deleteGrocery
};