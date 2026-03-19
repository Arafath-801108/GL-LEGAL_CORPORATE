function encryptAES(plainText) {
    const iv = CryptoJS.enc.Utf8.parse("\0".repeat(16));
    const keyBytes = CryptoJS.enc.Utf8.parse('Anu||@thattu*#0770||^TTT');

    const encrypted = CryptoJS.AES.encrypt(
        plainText,
        keyBytes,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return encrypted.toString();
}
function decryptAES(encryptedBase64) {
    const iv = CryptoJS.enc.Utf8.parse("\0".repeat(16));
    const keyBytes = CryptoJS.enc.Utf8.parse('Anu||@thattu*#0770||^TTT');
    const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedBase64);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedBytes },
        keyBytes,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}