const crypto = require('crypto');

const savePrivateKeyToDatabase = async (address, privateKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.JWT_SECRET), iv);
  let encryptedPrivateKey = cipher.update(privateKey, 'utf-8', 'hex');
  encryptedPrivateKey += cipher.final('hex');

  console.log(`Saving private key for address ${address}:`, {
    iv: iv.toString('hex'),
    encryptedPrivateKey,
  });

  // Replace with actual database call
};

module.exports = { savePrivateKeyToDatabase };
