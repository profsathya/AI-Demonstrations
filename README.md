# AI Capability Demonstrations

Interactive demonstrations of AI and Claude Code capabilities for educational purposes.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Adding New Demos

1. **Create demo folder**: `src/demos/your-demo-name/`

2. **Create the component**: Copy from `src/demos/_template/`
   ```
   src/demos/your-demo-name/
   ├── YourDemo.jsx
   └── YourDemo.css
   ```

3. **Register in index**: Edit `src/demos/index.js`
   ```javascript
   import YourDemo from './your-demo-name/YourDemo'

   export const demos = {
     'your-demo-name': {
       title: 'Your Demo Title',
       description: 'Brief description of the demo',
       icon: '🎯',
       tags: ['category1', 'category2'],
       component: YourDemo
     }
   }
   ```

4. **Access at**: `http://localhost:3000/demo/your-demo-name`

## Deploying to Netlify

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (creates new site or links existing)
netlify deploy --prod
```

### Option 2: Git Integration

1. Push to GitHub/GitLab
2. In Netlify Dashboard: **Add new site** → **Import an existing project**
3. Select your repository
4. Build settings are auto-detected from `netlify.toml`
5. Click **Deploy**

### Option 3: Drag & Drop

1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder

## Project Structure

```
AI-Demonstrations/
├── public/              # Static assets
├── src/
│   ├── components/      # Shared components
│   │   ├── Layout.jsx
│   │   └── DemoCard.jsx
│   ├── demos/           # Individual demos
│   │   ├── _template/   # Demo template
│   │   └── index.js     # Demo registry
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── DemoPage.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx          # Main app
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── netlify.toml         # Netlify config
├── vite.config.js       # Vite config
└── package.json
```

## Tech Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool
- **Netlify** - Hosting
