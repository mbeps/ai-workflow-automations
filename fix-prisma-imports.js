const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    if (file === "node_modules" || file === ".next" || file === "generated")
      return;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(process.cwd());
files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("@/generated/prisma")) {
    content = content.replace(/@\/generated\/prisma/g, "@prisma/client");
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
