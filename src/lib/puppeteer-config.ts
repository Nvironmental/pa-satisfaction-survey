// Puppeteer configuration that works for both local development and Digital Ocean deployment

export interface PuppeteerLaunchOptions {
  headless: boolean;
  args: string[];
  executablePath?: string;
}

export function getPuppeteerConfig(): PuppeteerLaunchOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDigitalOcean = process.env.DIGITALOCEAN_APP_ID || process.env.DOPPLER_PROJECT;
  
  // Base configuration
  const config: PuppeteerLaunchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  };

  // For Digital Ocean deployment (production)
  if (isProduction && isDigitalOcean) {
    // Use Google Chrome installed in Docker container (Daniel's proven approach)
    config.executablePath = '/usr/bin/google-chrome-stable';
    config.args.push(
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-plugins',
      '--single-process', // Important for low memory environments
      '--no-zygote',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--disable-images', // Speed up rendering
    );
  }

  return config;
}

export async function launchPuppeteerBrowser() {
  const puppeteer = await import('puppeteer');
  const config = getPuppeteerConfig();
  
  console.log('Launching Puppeteer with config:', {
    headless: config.headless,
    executablePath: config.executablePath,
    argsCount: config.args.length,
  });

  try {
    const browser = await puppeteer.default.launch(config);
    return browser;
  } catch (error) {
    console.error('Failed to launch Puppeteer with config:', config);
    console.error('Error:', error);
    
    // Fallback: try without executablePath (let Puppeteer find Chrome)
    console.log('Trying fallback: letting Puppeteer find Chrome automatically...');
    const fallbackConfig = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
    };
    
    try {
      const browser = await puppeteer.default.launch(fallbackConfig);
      console.log('Fallback successful: Puppeteer found Chrome automatically');
      return browser;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error; // Throw original error
    }
  }
}
