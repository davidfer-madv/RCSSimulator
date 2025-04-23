import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

// Define the base directory for file uploads
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Define the public URL path for accessing uploads
const UPLOADS_BASE_URL = '/uploads';

/**
 * Save a file to disk from a buffer
 * @param buffer The file buffer to save
 * @param originalName Original filename for extension
 * @returns URL path to access the file
 */
export function saveFile(buffer: Buffer, originalName: string): string {
  // Generate a unique filename with original extension
  const fileExtension = path.extname(originalName);
  const randomId = randomBytes(8).toString('hex');
  const timestamp = Date.now();
  const filename = `${timestamp}-${randomId}${fileExtension}`;
  
  // Create the full path
  const filePath = path.join(UPLOAD_DIR, filename);
  
  // Write the file to disk
  fs.writeFileSync(filePath, buffer);
  
  // Return the public URL path
  return `${UPLOADS_BASE_URL}/${filename}`;
}

/**
 * Delete a file from disk
 * @param fileUrl The URL path of the file to delete
 * @returns True if successfully deleted
 */
export function deleteFile(fileUrl: string): boolean {
  try {
    // Extract the filename from the URL
    const filename = path.basename(fileUrl);
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Check if file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}