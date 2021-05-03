const app = require('./app');
const mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
    console.log(`Listening on port ${server.address().port}`);
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


try{
    mongoose.connect('mongodb://localhost/petandi', {useNewUrlParser: true});
    console.log('Database connected');
} catch(error) {
    console.log(error);
}