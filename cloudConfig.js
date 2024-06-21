const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: "dyiscfshn",
  api_key: "926996494882518",
  api_secret: "NGNsAXmlYmRqW700rUikWnetbyA",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'AirbnbClone_DEV',
      allowedformats: ["png", "jpg", "jpeg"], // supports promises as well
    },
  });

  module.exports = {
    cloudinary,
    storage
  }