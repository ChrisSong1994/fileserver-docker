import express from "express";
import serveStatic from "serve-static";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

// 从环境变量获取配置，默认值为当前目录下的public文件夹

const STATIC_DIR = path.resolve(__dirname, "../statics");

exec(`cd ${STATIC_DIR} && ls`, (error, stdout) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  console.log("目录文件:", stdout);
});

const app = express();

if (!STATIC_DIR) {
  throw new Error("STATIC_DIR environment variable is not set");
}

app.use(
  serveStatic(STATIC_DIR, {
    index: ["index.html", "index.htm"],
  })
);

// 相当于 Nginx 的 try_files $uri $uri/ /index.html;
app.get(/(.*)/, async (req, res) => {
  let htmlPath = path.join(STATIC_DIR, req.url);
  const htmlPaths = getHtmlPath(htmlPath, path.join(STATIC_DIR, "index.html"));

  for (const path of htmlPaths) {
    if (fs.existsSync(path)) {
      htmlPath = path;
      break;
    }
  }

  // 检查 index.html 是否存在
  res.sendFile(htmlPath, (err) => {
    if (err) {
      // 如果 index.html 也不存在，返回 404
      res.status(404).send("Not Found: index.html missing in static directory");
    }
  });
});

app.listen(3080, () => {
  console.log(`Static server running at http://localhost:3080`);
});

function getHtmlPath(url: string, fallbackUrl: string) {
  if (!url.endsWith("/")) return [];
  const pathName = url.endsWith("/") ? url.slice(0, -1) : url;
  const urlHtmlPath = `${pathName}.html`;

  return [url, urlHtmlPath, fallbackUrl];
}
