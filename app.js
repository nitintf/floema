require('dotenv').config()

const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const logger = require('morgan')
const methodOverride = require('method-override');

const app = express()
const path = require('path')
const port = 3000

// For serving css files(static files)
app.use(express.static(path.join(__dirname, 'public')))

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());

const Prismic = require("@prismicio/client")
var PrismicDOM = require("prismic-dom")
const uaParser = require("ua-parser-js");


// Initialize the prismic.io api
const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
}

const handleLinkResolver = doc => {
  if (doc.type == 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type == 'about') {
    return '/about'
  }

  if (doc.type == 'collections') {
    return '/collections'
  }
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }
  return '/';
}


app.use( (req, res, next) => {
  const ua = uaParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver

  res.locals.PrismicDOM = PrismicDOM;
  res.locals.Numbers = index => {
    return index == 0 ? 'One': index==1 ? 'Two':index==2 ? 'Three':index==3 ? 'Four' : ''
  }
  next();
});

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest =async api => {
   const meta = await api.getSingle("meta");
   const preloader = await api.getSingle("preloader");
  const navigation = await api.getSingle("navigation");
  
  return {
    meta,
    navigation,
    preloader
  }
}

app.get('/',async (req, res) => {
    const api = await initApi(req);
  const home = await api.getSingle("home");
  const defaults =await handleRequest(api)
   
    const { results: collections } = await api.query(
      Prismic.Predicates.at("document.type", "collection"),
      {
        fetchLinks: "product.image",
      }
    );
    // response is the response object.Render your views here.
    res.render("pages/home", {
      home,
      collections,
      ...defaults
    });
})

app.get("/about",async (req, res) => {
  const api = await initApi(req)
  const about = await api.getSingle("about");
   const defaults =await handleRequest(api);
    // response is the response object.Render your views here.
    res.render("pages/about", {
      about,
      ...defaults
   });
});
  


app.get("/collections",async (req, res) => {
  const api = await initApi(req);
  const home = await api.getSingle("home");
  const defaults =await handleRequest(api);
  
    const { results: collections } = await api.query(
      Prismic.Predicates.at("document.type", "collection"), {
        fetchLinks: 'product.image'
      }
    );
   res.render("pages/collections", {
     collections,
     home,
     ...defaults
   });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api);

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })
    res.render("pages/detail", {
      ...defaults,
      product
    });
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})