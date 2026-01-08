import multer from "multer";

// After importing multer, we decide where incoming files should be stored temporarily.
// Multer basically asks: "Where should I keep the file bytes while parsing the request?"
//
// We have two main options:
// 1. memoryStorage
// 2. diskStorage
//
// We use memoryStorage because we don't want the backend to store files on the server.
// The file is only needed temporary so we can forward it to a cloud storage service (here Cloudinary).
// After the request finishes, the memory is automatically freed.
//
// PRO NOTE:
// memoryStorage is ideal when the backend acts as a pass-through
// and does not own or persist uploaded files.
//
// CASUAL NOTE (improved 😄):
// basically we just hold the file for a moment, send it to Cloudinary,
// and then forget about it — no server storage drama.
const storage = multer.memoryStorage();

// Create a reusable multer instance.
// This middleware will extract files from multipart/form-data requests,
// apply limits, and attach the file info to `req.file`.
export const multerGrabber = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Multer automatically matches files by field name (e.g. "profilePic")
// and exposes them on `req.file`.
//
// In short:
// - express.json() handles JSON bodies
// - multer handles multipart/form-data (files)
