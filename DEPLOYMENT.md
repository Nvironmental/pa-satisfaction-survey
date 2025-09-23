# Digital Ocean App Platform Deployment Guide

## PDF Export Fix for 512MB RAM Instance

This guide provides a solution for deploying your survey application to Digital Ocean App Platform with working PDF export functionality, specifically optimized for the 512MB RAM constraint.

## Problem

The original error occurs because Digital Ocean App Platform doesn't have Chrome/Chromium installed by default, and the 512MB RAM limit requires careful memory management.

## Solution

We've implemented a Docker-based solution that:
1. Installs Chromium in the Docker container
2. Uses environment-aware Puppeteer configuration
3. Optimizes for low memory usage
4. Works for both local development and production

## Files Added/Modified

- `src/lib/puppeteer-config.ts` - Environment-aware Puppeteer configuration
- `Dockerfile` - Multi-stage build optimized for 512MB RAM
- `.do/app.yaml` - Digital Ocean App Spec
- `.dockerignore` - Optimized Docker build
- Updated API routes to use new configuration

## Local Development

The solution works seamlessly in local development:
- Uses your local Chrome installation
- Works with both Bun (local) and npm (production)
- No additional configuration needed
- Same API endpoints

### Testing with npm (Optional)

To test with the same package manager as Digital Ocean:

```bash
# Run the test script
./scripts/test-with-npm.sh
```

This will:
1. Remove existing node_modules
2. Install dependencies with npm
3. Build and start the application
4. Allow you to test PDF export functionality

## Digital Ocean Deployment

### Option 1: Using App Spec (Recommended)

1. **Update the App Spec**:
   - Edit `.do/app.yaml`
   - Replace `your-username/your-repo-name` with your actual GitHub repo
   - Add your environment variables (DATABASE_URL, etc.)

2. **Deploy**:
   - Go to Digital Ocean App Platform
   - Create new app
   - Upload the `.do/app.yaml` file
   - Deploy

### Option 2: Manual Configuration

1. **Create App**:
   - Go to Digital Ocean App Platform
   - Create new app
   - Connect your GitHub repository

2. **Configure**:
   - Environment: Node.js
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Instance Size: Basic XXS (512 MB RAM)
   - Dockerfile Path: `Dockerfile`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

## Package Manager Compatibility

The solution handles the difference between local Bun and production npm:

- **Local Development**: Use Bun as usual (`bun dev`, `bun install`)
- **Production**: Dockerfile uses npm for consistency with Digital Ocean
- **Testing**: Optional script to test with npm locally

### Why This Matters

- Bun and npm can have slightly different dependency resolution
- Digital Ocean App Platform uses npm by default
- The Dockerfile ensures production uses npm for consistency

## Key Optimizations for 512MB RAM

The Dockerfile includes several optimizations:

1. **Multi-stage build** - Reduces final image size
2. **Alpine Linux** - Minimal base image
3. **Single-process mode** - Reduces memory usage
4. **Disabled images** - Speeds up rendering
5. **Non-root user** - Security best practice
6. **npm consistency** - Matches Digital Ocean's package manager

## Testing

After deployment:

1. Navigate to your deployed app
2. Complete a survey
3. Try exporting a PDF
4. Check logs for any issues

## Troubleshooting

### Common Issues:

1. **"Could not find Chrome" error**
   - Ensure Dockerfile is being used
   - Check that `PUPPETEER_EXECUTABLE_PATH` is set correctly

2. **Memory issues**
   - The `--single-process` flag helps with memory usage
   - Consider upgrading to Basic XS (1GB RAM) if needed

3. **Build failures**
   - Check that all environment variables are set
   - Ensure Dockerfile is in the root directory

### Debugging:

Check the Digital Ocean App Platform logs for detailed error messages. The Puppeteer configuration will log which Chrome executable it's using.

## Performance Notes

- PDF generation may be slower on 512MB RAM instances
- Consider caching PDFs for frequently accessed reports
- Monitor memory usage and scale if needed

## Cost Considerations

- Basic XXS (512MB) is the most cost-effective option
- If you experience memory issues, consider upgrading to Basic XS (1GB)
- Monitor usage and scale accordingly

## Alternative: Lighter PDF Generation

If you continue to have memory issues, consider switching to `@react-pdf/renderer` (already installed) which doesn't require a browser:

```typescript
import { pdf } from '@react-pdf/renderer';
// Generate PDF without browser
```

This approach uses significantly less memory but requires redesigning the PDF layout.
