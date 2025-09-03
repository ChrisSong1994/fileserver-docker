import express from "express";
import serveStatic from "serve-static";
import path from "path";
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

app.use(serveStatic(STATIC_DIR, { index: ["index.html", "index.htm"] }));

app.listen(3080, () => {
    console.log(`Static server running at http://localhost:3080`);
});
