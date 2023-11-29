import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { html } from "hono/html";
import { Counter } from "./components/Counter";
import { Hello } from "./components/Hello";
import type { Child } from 'hono/jsx'
import { generateCssString } from "./lib/atomic";

const app = new Hono();

const cssStrings: Record<string, string> = {}
let cssId = "";

app.use('*', async (c, next) => {
  await next();

  if (!c.req.path.endsWith(".css")) {
    const cssString = generateCssString()
    cssStrings[cssId] = cssString;
  }
})

app.get("/atomic-css/:cssId", (c) => {
  const cssId = c.req.param().cssId.replace('.css', '');

  c.res.headers.set('Content-Type', 'text/css')
  return c.text(cssStrings[cssId]);
})

app.get("/", (c) => {
  cssId = crypto.randomUUID();

  const htmlString = c.html(
    <Base headChildren={[<link rel="stylesheet" type="text/css" href={`atomic-css/${cssId}.css`}></link>]}>
      <Counter></Counter>
      <Hello></Hello>
    </Base>
  )

  return htmlString;
});

serve({
  fetch: app.fetch,
  port: 8787,
});

type BaseProps = {
  headChildren: Child[],
  children: Child[],
}

function Base(props: BaseProps) {
  return html`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>title</title>
        ${props.headChildren}
      </head>
      <body>
        ${props.children}
      </body>
    </html>`
}
