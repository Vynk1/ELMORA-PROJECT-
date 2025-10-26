// Railway entry point
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Import and run the server
const serverPath = join(__dirname, 'server', 'server.js');
require(serverPath);
