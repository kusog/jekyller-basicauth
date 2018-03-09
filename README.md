# Jekyller Authorization and Authentication Services
[Serverless](https://serverless.com/) nodesjs services setup for [AWS Lambdas](https://aws.amazon.com/lambda/) that aims to
provide basic authorization and authentication services for use within a [Jekyll](https://jekyllrb.com/) web site that is
using Jekyller services.

This implementation uses an encrypted file of users that can login to the site.  The encrypted file is created from a basic
plain text JSON file containing the site user logins.  The encrypted file can be created using:

```aws kms encrypt --key-id alias/[Your Key Name] --region [Your Region]  --plaintext file://../userbase.json --query CiphertextBlob --output text | base64 -D >userbase.txt```

Before you can run this command, you'll need to setup the encryption key used in AWS [Key Management System (KMS)](https://aws.amazon.com/kms). 
Setup the key using a name associated with the lambda project for the website using it and use it in the encrypt command above.  You'll also
need to keep track of the AWS region your lambda is running in.

The above command also depends on the unencrypted file being located in the parent directory of the auth services project folder.  The unencrypted file should be formated as such:

```
{
    "users" : {
        "admin" : {
            "userId": "admin",
            "pwd": "password",
            "role": "admin",
            "displayName": "admin",
            "status": 1
        },
        "test" : {
            "userId": "test",
            "pwd": "password",
            "displayName": "test",
            "role": "user",
            "status": 0
        }
    }
}
```

The static field of each user indicates if the user is able to login.  If the status is zero, the user is considered disabled and the 
key wont authenticate.