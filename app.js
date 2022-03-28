require ('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
//const env = require ('dotenv').config({ path: __dirname + './env'});

const mongoose = require('mongoose');
const app = express();
app.use(express.urlencoded({ extended: true})) // function of express init
const Item = require('./models/items');
const mongodb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.syn6a.mongodb.net/crud-db?retryWrites=true&w=majority`;

mongoose.connect(mongodb) //, { useNewUrlParser: true })
    .then( () => {
        console.log('DB Connected !! ');
        app.listen(4000);
    })
    .catch( (error) => console.log ('Errr is: ', error)  )

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.redirect('/get-items');
    // const items = [
    //     { name: 'Mobile Phone', price: 1000 },
    //     { name: 'book', price: 30 },
    //     { name: 'Computer', price: 2000  },
    // ];
    // res.render('index', { items });
    // res.sendFile('./views/index.html', { root: __dirname } );
})

// To get Items
app.get('/get-items', (req, res) => {
    Item.find()
        .then(result => {
            res.render('index', { items: result });
}).catch(error => { console.log('Can\'t got items lists:', error); }) //end catch 
})

app.get('/add-item', (req,res) => {
    res.render('add-item');
//    res.sendFile('./views/add-item.html', { root: __dirname } ); 
})

app.post('/items', (req,res) => {
    // console.log( req.body);
    const newItem = Item(req.body)
    newItem.save().then( () => { res.redirect('/get-items')})
                   .catch(err => console.log('Error caught', err));
    // res.redirect('/get-items')
})

app.get('/items/:id', (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    Item.findById(id).then( (result) => {
        console.log('Res is:', result);
        res.render('item-detail', { newItem: result })
    }).catch(err => console.log(err))
})

app.delete('/items/:id', (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    Item.findByIdAndDelete(id).then(result => {
         res.json({ redirect: '/get-items' });

        // console.log('Res is:', result);
        // res.render('item-detail', { newItem: result })
    }).catch(err => console.log('Error in request while deleted:', err))
})

// Edit the put request 
app.put('/items/:id', (req, res) => {
    const id = req.params.id;
    Item.findByIdAndUpdate(id, req.body).then(result => {
         res.json({ msg: 'Updated Successfully ' })
    })
    // .catch(err => console.log('Error in Updating form :', err))
})

app.use( (req, res) => { // app.use used  at the bottom of file to collect every request don't matching the above.
        // res.sendFile('./views/error.html', { root: __dirname });
     res.render('error');
})