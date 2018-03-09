const aws = require('aws-sdk');
const fs = require('fs');

module.exports.getSecrets = (file) => {
    const kms  = new aws.KMS({ region: 'us-east-1'});
    const encryptedFile  = fs.readFileSync(file);
    const params = { CiphertextBlob: Buffer.from(encryptedFile, 'base64')};

    return new Promise((resolve, reject) => {
        kms.decrypt(params, function(e, data) {
            if(e) {
                reject(e);
            }
            else {
                resolve(JSON.parse(data.Plaintext.toString()));
            }
        });
    });
};

module.exports.createToken  = (user) => {
    const kms  = new aws.KMS({ region: 'us-east-1'});
    const contents = {
        displayName: user.displayName,
        userId: user.userId
    };
    const params = {
        KeyId: "alias/jekyller",
        Plaintext: JSON.stringify(contents)
    };

    return new Promise((resolve, reject) => {
        kms.encrypt(params, function(e, data) {
            if(e) {
                reject(e);
            }
            else {
                var tokenTxt = data.CiphertextBlob.toString('base64');
                console.log("createToken:" + tokenTxt);
                resolve(tokenTxt);
            }
        });
    });
};

module.exports.inspectToken = (token) => {
    const kms  = new aws.KMS({ region: 'us-east-1'});
    const params = { CiphertextBlob: Buffer.from(token, 'base64')};

    return new Promise((resolve, reject) => {
        console.log("token2:" + token);
        kms.decrypt(params, function(e, data) {
            if(e) {
                reject(e);
            }
            else {
                resolve(JSON.parse(data.Plaintext.toString()));
            }
        });
    });
};