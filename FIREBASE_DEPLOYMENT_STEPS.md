# Firebase Deployment Steps (For Next.js)

## Steps
1. Install Firebase Tools
```bash
npm install -g firebase-tools
```
<br>

2. Login Firebase from CLI
```bash
firebase login
```
<br>

3. Initialize Firebase in the project
```bash
firebase init
```
Note:
-	Select "Configure files for Firebase Hosting and (optionally)
	set up GitHub Action deploys" option
- Provide "out" as the build folder.
- Select "No" for the question "Configure as a
	single-page app (rewrite all urls to /index.html)?" 

<br>

4. Update build script and build the project
> “build”: “next build && next export”
```bash
npm run build
```

5. Deploy the project
```bash
firebase deploy
```