const express = require('express');
const sequelize = require('./db');
const userRouters = require('./routers/user_router');

const app = express();
const port = 3443;


app.use(express.json());

app.use('/users', userRouters);



(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        await sequelize.sync();
        console.log('Models synchronized.');

    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
