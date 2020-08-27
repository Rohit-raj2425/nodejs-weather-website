const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//setup handlerbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Rohit Raj'
    })
})

app.get('/about',(req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Rohit Raj'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Rohit Raj'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error:'you must provide an address'
        })
    } else {
        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if(error) {
                return res.send({error})
            }

            forecast(latitude,longitude, (error, forecastData) => {
                if(error){
                    return res.send({error})
                }
                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                })
            })
        })
    }

    // res.send({
    //     forecast:'It is snowing',
    //     location:'philadelphia',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404' , {
        title: '404',
        errorMessage: 'Help Article not found',
        name: 'rohit raj'
    })
})



app.get('*',(req, res) => {
    res.render('404', {
        title: '404',
        name: 'Rohit Raj',
        errorMessage: 'page not found'
    })
})
//app.com
//app.com/help
//app.com/about

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})