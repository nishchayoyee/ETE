const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;


const uri = 'mongodb+srv://kanav1093:kanav1093@cluster0.tsq8knz.mongodb.net/';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/savedata', async (req, res) => {
  const { gender, age, weight, height, bmiValue, bmiResult } = req.body;

  try {

    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db();


    await db.collection('bmiData').insertOne({
      gender,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      bmiValue: parseFloat(bmiValue),
      bmiResult
    });

    client.close();

    return res.json({ message: 'BMI data saved successfully' });
  } catch (error) {
    console.error('Error saving BMI data:', error);
    return res.status(500).json({ error: 'An error occurred while saving BMI data' });
  }
});


app.get('/summary/:gender', async (req, res) => {
  const { gender } = req.params;

  try {

    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db();


    const pipeline = [
      { $match: { gender: gender.toLowerCase() } },
      {
        $group: {
          _id: {
            $cond: [
              { $and: [{ $gte: ['$age', 6] }, { $lte: ['$age', 8] }] },
              '6-8',
              { $cond: [{ $and: [{ $gte: ['$age', 9] }, { $lte: ['$age', 12] }] }, '9-12', ''] }
            ]
          },
          averageBMI: { $avg: '$bmiValue' }
        }
      }
    ];

    const summary = await db.collection('bmiData').aggregate(pipeline).toArray();

    client.close();

    return res.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'An error occurred while generating the summary' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
