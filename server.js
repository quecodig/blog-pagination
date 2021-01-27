require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

app.set("port", process.env.PORT || 5000);

mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  res.render('index')
})

app.get('/blog/', async (req, res) => {
	const PAGE_SIZE = parseInt(process.env.PAGE_BLOG);
	const articles = await Article
	const count = await articles.countDocuments()
	const allArticles = await articles.find().skip(0).limit(PAGE_SIZE).sort({ createdAt: 'desc' })
	res.render('articles/index', { articles: allArticles, pages: count / PAGE_SIZE })
})

app.get('/blog/page/:id', async (req, res) => {
	const page = parseInt(req.params.id);
	const PAGE_SIZE = parseInt(process.env.PAGE_BLOG);
	const skip = (page - 1) * PAGE_SIZE;
	const articles = await Article
	const count = await articles.countDocuments()
	const allArticles = await articles.find().skip(skip).limit(PAGE_SIZE).sort({ createdAt: 'desc' })
	res.render('articles/index', { articles: allArticles, pages: count / PAGE_SIZE })
})

app.use('/blog', articleRouter)

app.listen(app.get('port'), () =>{
	console.log('Server on port', app.get('port'))
	console.log('Environment:', process.env.NODE_ENV)
})