import { LOCAL_API_HOST } from './api';

export const DEFAULT_LANG = 'en';
export const DEFAULT_MODE = 'student';

// avoid breaking the app in production when embedded in different contexts
let defaultApiHost;
try {
  defaultApiHost =
    window.parent.location.hostname === 'localhost' ? LOCAL_API_HOST : null;
} catch (e) {
  console.error(e);
  defaultApiHost = null;
}

export const DEFAULT_API_HOST = defaultApiHost;

// we haven't decided what to call the teacher mode
export const TEACHER_MODES = ['teacher', 'producer', 'educator', 'admin'];

export const MAX_NUM_FILES = 1;
// ten megabytes times 1024 kilobytes/megabyte * 1024 bytes/kilobyte
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['.pdf'];

export const DEFAULT_VISIBILITY = 'private';
export const PRIVATE_VISIBILITY = 'private';
export const PUBLIC_VISIBILITY = 'public';
