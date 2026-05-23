const cloudinary = require("../config/cloudinary");
const getDataUri = require("./dataUri");

const uploadToCloudinary = async (file, folder) => {
  if (!file) {
    return null;
  }

  if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
    console.error("Cloudinary upload skipped: missing Cloudinary environment variables");
    return null;
  }

  const fileUri = getDataUri(file);
  if (!fileUri || !fileUri.content) {
    return null;
  }

  const options = {};
  if (folder) {
    options.folder = folder;
  }

  return cloudinary.uploader.upload(fileUri.content, options);
};

module.exports = uploadToCloudinary;
