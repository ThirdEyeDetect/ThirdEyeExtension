
/**
 * Anonymize Function
 */
function AnonymizeContent(entry,clientKey){
  entry['Anon'] = "True";
  var entryContent = entry['Content'];
  var contentKeyArray = Object.keys(entryContent);
  for (var i=0; i<contentKeyArray.length; i++) {
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(entryContent[contentKeyArray[i]]), clientKey, { format: JsonFormatter });
    //encrypted["consistenthash"] = CryptoJS.SHA512(entryContent[field]);
    entryContent[contentKeyArray[i]] = JsonFormatter.stringify(encrypted);
  }
}

function DeAnonymizeContent(entry,clientKey){
  if(!entry['Anon']){return;}
  var entryContent = entry['Content'];
  var contentKeyArray = Object.keys(entryContent);
  for (var i=0; i<contentKeyArray.length; i++) {
    //Check for consistent hash (not added but do add this)
    var decrypted = CryptoJS.AES.decrypt(JsonFormatter.parse(entryContent[contentKeyArray[i]]), clientKey);
    entryContent[contentKeyArray[i]] = decrypted.toString(CryptoJS.enc.Utf8);
  }
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