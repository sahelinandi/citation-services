import crypto from 'crypto';
import envVariables from "../envVariables";

const algorithm = 'aes-256-cbc';
//const key = crypto.randomBytes(32);
const key = crypto.createHash('sha256').update(String(envVariables.ENCRYPTION_KEY)).digest('base64').substr(0, 32);
const iv = crypto.createHash('sha256').update(String(envVariables.ENCRYPTION_IV)).digest('base64').substr(0, 16);;

export const encrypt = (text) => {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return encrypted.toString('hex');
}
export const decrypt = (text) => {
 
 let encryptedText = Buffer.from(text, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

/* export const encrypt = (text) => {
 let cipher = crypto.createCipher(algorithm, Buffer.from(key));
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return encrypted.toString('hex') ;
}

export const decrypt = (text) => {
 let encryptedText = Buffer.from(text, 'hex');
 let decipher = crypto.createDecipher(algorithm, Buffer.from(key));
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}  */