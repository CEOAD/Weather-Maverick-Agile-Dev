const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./db.js');

const app = express();
const port = 8000;
const uri = 'mongodb+srv://surf:surf@myweatheruserscluster.mjq0rxo.mongodb.net/?retryWrites=true&w=majority';

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

app.listen(port, () => {
  console.log(`Server started, listening on port ${port}`);
});


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  const { username, email, dob, password } = req.body;
  if (!password) {
    console.log(res.statusMessage)
    return res.status(400).send('Password is required');
  }  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    dob,
    password: hashedPassword,
  });
  await user.save();
  res.send('User created successfully');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).send('Invalid password.');
  }
  res.send('Login successful');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/Mainpage/MainPage.html');
  });
  

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Mainpage/MainPage.html');
});

app.get('/public/loginpage.html', (req, res) => {
    res.sendFile(__dirname + '/public/signup_page/signup_page.html');
  });
  

