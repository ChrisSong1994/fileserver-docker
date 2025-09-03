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

app.use(
  serveStatic(STATIC_DIR, {
    index: ["index.html", "index.htm"],
  })
);

// 相当于 Nginx 的 try_files $uri $uri/ /index.html;
app.get(/(.*)/, (req, res) => {
  const indexPath = path.join(STATIC_DIR, "index.html");

  // 检查 index.html 是否存在
  res.sendFile(indexPath, (err) => {
    if (err) {
      // 如果 index.html 也不存在，返回 404
      res.status(404).send("Not Found: index.html missing in static directory");
    }
  });
});

// try_file
// app.get("*", (req, res) => {
//   res.sendFile(path.join(STATIC_DIR, "index.html"));
// });

app.listen(3080, () => {
  console.log(`Static server running at http://localhost:3080`);
});
