15:42:10.530 Running build in Washington, D.C., USA (East) – iad1
15:42:10.531 Build machine configuration: 2 cores, 8 GB
15:42:10.544 Cloning github.com/kulturepapi/call_guide (Branch: Call-guide-v2, Commit: 0291c84)
15:42:10.545 Skipping build cache, deployment was triggered without cache.
15:42:10.794 Cloning completed: 250.000ms
15:42:11.094 Running "vercel build"
15:42:11.112 Vercel CLI 54.9.0
15:42:11.597 Installing dependencies...
15:42:25.451 
15:42:25.452 added 62 packages in 14s
15:42:25.452 
15:42:25.453 7 packages are looking for funding
15:42:25.453   run `npm fund` for details
15:42:25.491 Running "npm run build"
15:42:25.598 
15:42:25.599 > fonio-call-guide@1.0.0 build
15:42:25.599 > vite build
15:42:25.599 
15:42:26.129 vite v5.4.21 building for production...
15:42:26.176 transforming...
15:42:26.270 ✓ 12 modules transformed.
15:42:26.272 x Build failed in 120ms
15:42:26.272 error during build:
15:42:26.273 Could not resolve "./fonio_call_guide_v2.jsx" from "src/fonio_call_guide.jsx"
15:42:26.273 file: /vercel/path0/src/fonio_call_guide.jsx
15:42:26.273     at getRollupError (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:317:41)
15:42:26.274     at error (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:313:42)
15:42:26.274     at ModuleLoader.handleInvalidResolvedId (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:22119:24)
15:42:26.274     at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:22079:26
15:42:26.298 Error: Command "npm run build" exited with 1
