
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '1234', 
  database: 'enqeryform'
});

db.connect((err) => {
  if (err) throw err;
  console.log('database conected');
});

app.post('/create-question-table/:tname', (req, res) => {
  const { inputFields } = req.body;
  let tname = req.params.tname

  let createTableQuery = `CREATE TABLE if not exists Ques_${tname} (id INT AUTO_INCREMENT PRIMARY KEY, `;
  inputFields.forEach((field) => {
    if (field.type === 'text') {
      createTableQuery += `question_${field.id} TEXT, `;
    } else if (field.type === 'radio') {
      createTableQuery += `question_${field.id}_label TEXT, `;
      field.options.forEach((option) => {
        createTableQuery += `question_${field.id}_option_${option.id} TEXT, `;
      });
    }
  });

  createTableQuery = createTableQuery.slice(0, -2);
  createTableQuery += ');';

  db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    res.send('Table created.');
  });
});


app.post('/submit-form/:tname', (req, res) => {
    const { inputFields } = req.body;
  let tname = req.params.tname
   
  console.log(inputFields)

    let columns = `INSERT INTO Ques_${tname} (`;
    let values = 'VALUES (';
  
    inputFields.forEach((field) => {
      if (field.type === 'text') {
        columns += `question_${field.id}, `;
        values += `'${field.value}', `;
      } else if (field.type === 'radio') {
        columns += `question_${field.id}_label, `;
        values += `'${field.value}', `;
        field.options.forEach((option) => {
          columns += `question_${field.id}_option_${option.id}, `;
          values += `'${option.value}', `;
        });
      }
    });
  
    columns = columns.slice(0, -2) + ') ';
    values = values.slice(0, -2) + ')';
  
    const insertQuery = columns + values;
  
    db.query(insertQuery, (err, result) => {
      if (err) throw err;
      res.send('Form data submitted');
    });
  });



  app.post('/create-answer-table/:tname', (req, res) => {
    const { formData } = req.body;
  let tname = req.params.tname
  
    let createTableQuery = `CREATE TABLE if not exists ans_${tname} (id INT AUTO_INCREMENT PRIMARY KEY, `;
    for (let id in formData) {
      createTableQuery += `question_${id} TEXT, `;
    
    }

    createTableQuery = createTableQuery.slice(0, -2);
    createTableQuery += ');';
  
    db.query(createTableQuery, (err, result) => {
      if (err) throw err;
      res.send('second created');
    });
  });


  app.post('/submit-second-form/:tname', (req, res) => {
    const { formData } = req.body;
    let tname = req.params.tname
  
    let columns = `INSERT INTO ans_${tname} (`;
    let values = 'VALUES (';
  
    for (let id in formData) {
      columns += `question_${id}, `;
      values += `'${formData[id]}', `;
    }

    columns = columns.slice(0, -2) + ') ';
    values = values.slice(0, -2) + ')';
  
    const insertQuery = columns + values;
  
    db.query(insertQuery, (err, result) => {
      if (err) throw err;
      res.send('Form data submitted');
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
