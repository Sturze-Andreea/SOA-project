const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const animalsRouter = require('./routes/animals'); 
const adoptionRouter = require('./routes/adoption'); 
const authRouter = require('./routes/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); 
app.use(express.json()); 

app.use('/api/animals', animalsRouter); 
app.use('/api/adoption', adoptionRouter); 
app.use('/api/auth', authRouter); 

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
