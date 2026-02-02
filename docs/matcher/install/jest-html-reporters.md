# jest-html-reportersのインストール

```bash
npm install --save-dev jest-html-reporters
```

```diff ts
// jest.config.ts
+    [
+      "jest-html-reporters",
+      {
+        publicPath: "./output/html-report",
+        filename: "index.html",
+        expand: true,
+      },
+    ],
```