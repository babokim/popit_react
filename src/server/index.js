import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import serialize from "serialize-javascript";
import App from '../App';
import PostApi from "../services/PostApi";
import { routes, PUBLIC_PATH } from '../routes';
import MobileDetect from 'mobile-detect';

const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("*", (req, res, next) => {
  const md = new MobileDetect(req.headers['user-agent']);
  const isMobile = md.mobile() ? true : false;

  const activeRoute = routes.find((route) => matchPath(PUBLIC_PATH + req.url, route)) || {};

  const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req.path) : Promise.resolve();

  promise.then((data) => {
    const context = { data };

    let detailPage = false;
    let ogUrl = `https://www.popit.kr${decodeURIComponent(req.path)}`;
    let dableMeta = "";

    let description = "전문 지식 공유를 위한 팀블로그";
    let title = "Popit";
    if (activeRoute.path === PUBLIC_PATH + '/:permalink/' && context.data && context.data.data) {
      detailPage = true;
      ogUrl = PostApi.getCanonicalLink(context.data.data);

      dableMeta = `<meta property="dable:item_id" content="${context.data.data.id}"/>\n`;
      dableMeta += `<meta name="dable:author" content="${context.data.data.author.displayName}"/>\n`;
      let catalog = "미분류";
      if (context.data.data.categories && context.data.data.categories.length > 0) {
        catalog = context.data.data.categories[0].name;
      }
      dableMeta += `<meta name="article:section" content="${catalog}"/>\n`;
      dableMeta += `<meta name="article:published_time" content="${context.data.data.date}" />\n`;

      description = context.data.data.socialDesc;
      title = context.data.data.title + " | Popit";
    }

    const markup = renderToString(
      <StaticRouter location={PUBLIC_PATH + req.url} context={context}>
        <App isMobile={isMobile}/>
      </StaticRouter>
    );

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>

          <link href="https://www.popit.kr/wp-content/uploads/2016/08/favicon_32x32.png" rel="shortcut icon" /> 
          <link rel='next' href='https://www.popit.kr/page/2/' />
          <link rel="canonical" href="${ogUrl}" />

          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, user-scalable=no">
          ${dableMeta}
          <meta name="description" itemprop="description" content="${description}" />
          <meta property="og:title" content="Pop your experience. Share it." />
          <meta property="og:url" content="${ogUrl}" />
          <meta property="og:image" content="https://www.popit.kr/wp-content/uploads/2016/08/logo.png" />
          <meta property="og:site_name" content="Popit" />
          <meta property="og:description" content="${description}" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Pop your experience. Share it." />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="https://www.popit.kr/wp-content/uploads/2016/08/logo.png" />
          <meta itemprop="image" content="https://www.popit.kr/wp-content/uploads/2016/08/logo.png" />

          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>

          <link rel='stylesheet' id='crayon-css'  href='https://www.popit.kr/wp-content/plugins/crayon-syntax-highlighter/css/min/crayon.min.css' type='text/css' media='all' />
          <link rel='stylesheet' id='crayon-theme-obsidian-css'  href='https://www.popit.kr/wp-content/plugins/crayon-syntax-highlighter/themes/obsidian/obsidian.css' type='text/css' media='all' />
          <link rel='stylesheet' id='crayon-font-monaco-css'  href='https://www.popit.kr/wp-content/plugins/crayon-syntax-highlighter/fonts/monaco.css' type='text/css' media='all' />
        </head>

        <body>
          <div id="app">${markup}</div>
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-9913849834747247",
              enable_page_level_ads: true
            });
          </script>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-80256805-1"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-80256805-1');
          </script>
          <script src="${PUBLIC_PATH}/bundle.js"></script>
      </html>
    `)
  }).catch(error => {
    const message = error.message;
    console.log("error message:", error);
    next();
  })
});

const server = app.listen(5000, () => {
  console.log(`Server is listening on port: 5000`)
});

server.keepAliveTimeout = 60000 * 2;

/*
  1) Just get shared App rendering to string on server then taking over on client.
  2) Pass data to <App /> on server. Show diff. Add data to window then pick it up on the client too.
  3) Instead of static data move to dynamic data (github gists)
  4) add in routing.
*/
