# Deployment Guide

## Deploying to Vercel

This application is optimized for deployment on Vercel's serverless platform.

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional)
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Quick Deploy

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Setup API for screenshot generation"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Vercel will auto-detect Next.js settings

3. **Configure Project:**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your API will be live at `https://your-project.vercel.app/api/generate`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Configuration

The project includes a `vercel.json` with optimized settings:

```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/generate/route.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**Configuration Details:**
- `memory: 1024` - Allocates 1GB RAM for Puppeteer/Chromium
- `maxDuration: 30` - Allows up to 30 seconds for image generation

### Environment Variables

No environment variables are required for basic deployment. However, you can add:

```bash
# Optional: For local development
NODE_ENV=production
```

To add environment variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, or Development

### Post-Deployment

After deployment:

1. **Test your API:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/generate \
     -H "Content-Type: application/json" \
     -d '{"messenger":"telegram","contactName":"Test","messages":[{"id":"1","text":"Hello!","sender":"contact"}]}' \
     --output test.png
   ```

2. **Check API documentation:**
   ```bash
   curl https://your-project.vercel.app/api/generate
   ```

3. **Monitor performance:**
   - Go to your Vercel dashboard
   - Check "Analytics" for usage stats
   - Monitor "Functions" for performance metrics

### Vercel Limits (Hobby Plan)

- **Execution Time:** 10 seconds (increase to 30s with `maxDuration` in Pro plan)
- **Memory:** 1024 MB
- **Bandwidth:** Fair use policy
- **Builds:** Unlimited

For production use, consider upgrading to Vercel Pro for:
- Extended execution time (up to 60s)
- More memory (up to 3GB)
- Advanced analytics
- Team collaboration

### Troubleshooting

#### Build Fails

**Error:** `Cannot find module 'puppeteer-core'`
```bash
# Ensure dependencies are installed
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### Function Timeout

**Error:** `Task timed out after 10 seconds`

**Solution:** Upgrade to Vercel Pro to use `maxDuration: 30` (already configured in `vercel.json`)

#### Memory Issues

**Error:** `JavaScript heap out of memory`

**Solution:** The function is already configured with 1024MB. If issues persist:
1. Reduce image quality in the screenshot function
2. Upgrade to Vercel Pro for more memory
3. Optimize the HTML template

#### Chromium Loading Issues

**Error:** `Could not find Chrome`

**Solution:** The project uses `@sparticuz/chromium` which is optimized for Vercel. This should work automatically. If issues persist:
1. Check that `@sparticuz/chromium` is in `dependencies` (not `devDependencies`)
2. Ensure the build completes successfully
3. Check Vercel function logs for detailed errors

### Local Development

To test the API locally before deploying:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Chrome/Chromium (for local testing):**

   **macOS:**
   ```bash
   brew install --cask google-chrome
   ```

   **Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y chromium-browser
   ```

   **Windows:**
   - Download and install [Google Chrome](https://www.google.com/chrome/)

3. **Set Chrome path (optional):**
   ```bash
   cp .env.example .env
   # Edit .env and set CHROME_EXECUTABLE_PATH if needed
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Test API locally:**
   ```bash
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"messenger":"telegram","contactName":"Test","messages":[{"id":"1","text":"Hello!","sender":"contact"}]}' \
     --output test.png
   ```

Or use the test script:
```bash
node examples/test-api.js
```

### Build and Test

Before deploying, test the production build locally:

```bash
# Build the project
npm run build

# Start production server
npm start

# Test the API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"messenger":"telegram","contactName":"Test","messages":[{"id":"1","text":"Hello","sender":"contact"}]}' \
  --output test.png
```

### Monitoring

**Vercel Dashboard:**
- Real-time function logs
- Performance analytics
- Error tracking

**Custom Monitoring:**
Consider integrating:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay
- [Datadog](https://www.datadoghq.com/) for APM

### Security Recommendations

1. **Rate Limiting:**
   - Add rate limiting middleware
   - Use Vercel Edge Middleware for protection

2. **Authentication:**
   - Implement API key authentication
   - Use environment variables for secrets

3. **Input Validation:**
   - Already implemented basic validation
   - Consider adding more strict validation rules

4. **CORS:**
   - Configure CORS headers if needed
   - Restrict to specific domains in production

### Performance Optimization

1. **Caching:**
   - Implement cache for repeated requests
   - Use Vercel Edge Cache

2. **Image Optimization:**
   - Already using 2x pixel ratio
   - Consider adding quality parameter

3. **Cold Start:**
   - First request may be slower
   - Consider warming functions

### Custom Domain

To use a custom domain:

1. Go to your project in Vercel
2. Navigate to "Settings" → "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Your API will be available at `https://api.yourdomain.com/generate`

### Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pushes to other branches
- **Pull Requests:** Automatic preview deployments

### Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

---

**🚀 Happy Deploying!**
