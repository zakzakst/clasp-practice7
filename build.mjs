import "dotenv/config";
import esbuild from "esbuild";
import fs from "fs/promises";
import path from "path";

await esbuild.build({
  bundle: true,
  define: {
    // NOTE: `JSON.stringify`は必要 ※利用しないと文字列の前後にダブルコートがつかない
    "process.env.SHEET_ID": JSON.stringify(process.env.SHEET_ID ?? ""),
  },
  entryPoints: ["src/index.ts"],
  format: "cjs",
  outdir: "dist",
  platform: "browser",
  target: "es2019",
  treeShaking: false,
  minifyWhitespace: true,
});

try {
  await fs.cp("src/html", "dist", { recursive: true });
  console.log("HTML files copied successfully to dist/html");
} catch (error) {
  console.error("Error copying HTML files:", error);
}
