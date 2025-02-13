const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const LogInCollection = require("./mongodb");

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    console.log("Rendering home page with name:", req.query.naming);
    if (!req.query.naming) {
        console.log("No name provided in query.");
    } else {
        console.log("Name provided:", req.query.naming);
    }
    res.render('home', { naming: req.query.naming });
});

app.post('/signup', async (req, res) => {
    const data = new LogInCollection({
        name: req.body.name,
        password: req.body.password
    });
    await data.save();

    const checking = await LogInCollection.findOne({ name: req.body.name });

    if (!checking) {
        return res.status(400).send("User does not exist");
    }

    try {
        if (checking.name === req.body.name && checking.password === req.body.password) {
            return res.send("user details already exists");
        } else {
            await LogInCollection.insertMany([data]);
        }
    } catch {
        return res.send("wrong inputs");
    }

    return res.redirect(`/home?naming=${encodeURIComponent(req.body.name)}`);
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (!check) {
            return res.status(400).send("User does not exist");
        } else if (check.password === req.body.password) {
            return res.redirect(`/home?naming=${encodeURIComponent(req.body.name)}`);
        } else {
            return res.send("incorrect password");
        }
    } catch (e) {
        res.send("wrong details");
    }
});

app.listen(port, () => {
    console.log('port connected');
});
