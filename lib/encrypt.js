/**
 * 
 * Encryption Function
 * 
 */
 
function EncryptContextData(entry,publickey){
  var entryContent = entry['Content'];
  if(isEmpty(entryContent)){return entry;}  
  var randomKey = randomString(16);
  console.dir(randomKey);
  var AESencrypted = CryptoJS.AES.encrypt(JSON.stringify(entryContent), randomKey, { format: JsonFormatter });
  entry['Content']= JsonFormatter.stringify(AESencrypted);
  var rsacrypt = new JSEncrypt();
  rsacrypt.setPublicKey(publickey);
  entry['EncryptedRandomKey'] = rsacrypt.encrypt(randomKey);
  return entry;
}

var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            // optionally add iv and salt
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }

            // stringify json object
            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            // optionally extract iv and salt
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
            }

            return cipherParams;
        }
    };
    

