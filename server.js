var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');

// Create an Express App
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting_dojo');

var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quote: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at' }});

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'codingdojorocks'}));
app.use(express.static(path.join(__dirname, './static')));

// Set our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Set our View Engine set to EJS
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res) {
    res.render('index', {errors: req.session.errors});
})

app.get('/quotes', function(req, res) {
  Quote.find({}, function(err, data) {
    if (err) {
        console.log('something went wrong');
    } else {
        console.log('successfully retrieved quotes!');
        res.render('quotes', {quotes: data});
    }
  })
})

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    quote.save(function(err) {
      if (err) {
          console.log('something went wrong');
          req.session.errors = quote.errors;
          res.redirect('/');
      } else {
          console.log('successfully added a quote!');
          res.redirect('/quotes');
      }
    })
})

// Set our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
