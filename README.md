# Jekyller Authorization and Authentication Services
[Serverless](https://serverless.com/) nodesjs services setup for [AWS Lambdas](https://aws.amazon.com/lambda/) that aims to
provide basic authorization and authentication services for use within a [Jekyll](https://jekyllrb.com/) web site that is
using Jekyller services.

This implementation uses an encrypted file of users that can login to the site.  The encrypted file is created from a basic
plain text JSON file containing the site user logins.  The encrypted file can be created using:

```aws kms encrypt --key-id alias/jekyller --region us-east-1  --plaintext file://../userbase.json --query CiphertextBlob --output text | base64 -D >userbase.txt```
