# Example Node Express Server

---
## Disclaimer!
__!!!THIS EXAMPLE SERVER IS NOT MEANT TO BE DEPLOYED TO PRODUCTION.  THIS IS FOR REFERENCE ONLY!!!__

__This is a simplified example to show the endpoints you will likely want to connect to.__

__It does not contain security protocols you will need to have in place before deploying for real.__

---


<br />
<br />
## Build & Run Docker Container
Run these commands from `example-server/`:
```bash
$ docker build . -t example-server
$ docker run --env CLIENT_ID=<YOUR_CLIENT_ID> --env CLIENT_SECRET=<YOUR_CLIENT_SECRET> -d -p 7000:7000 example-server
```

Server available at: `http://0.0.0.0:7000/`

## /register-user
_Registers a new user to your Tilia account._
```bash
curl --location --request POST 'http://0.0.0.0:7000/register-user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "USERNAME",
    "email": {
        "address": "USER-EMAIL@EMAIL-ADDRESS.COM",
        "requires_verification": false
    },
    "full_name": "John Doe",
    "street_address_1": "123 Main St.",
    "street_address_2": "BLDG 3",
    "street_address_3": "APT 6",
    "city": "Anytown",
    "state_province": "CA",
    "country": "US",
    "zip_postal_code": "55555"
}'
```

## /get-account-profile
_Retrieves user information for the supplied account ID._
```bash
curl --location --request POST 'http://0.0.0.0:7000/get-account-profile' \
--header 'Content-Type: application/json' \
--data-raw '{
    "account_id": "USER_TILIA_ACCOUNT_ID"
}'
```

## /get-user-token
_Retrieves a user token which can be used in other methods to perform actions on that user._
```bash
curl --location --request POST 'http://0.0.0.0:7000/get-user-token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "account_id": "USER_TILIA_ACCOUNT_ID"
}'
```

## /get-payment-methods
_Retrieves payment methods for the supplied account ID._
```bash
curl --location --request POST 'http://0.0.0.0:7000/get-account-profile' \
--header 'Content-Type: application/json' \
--data-raw '{
    "account_id": "USER_TILIA_ACCOUNT_ID"
}'
```

## /authorize-invoice
_Creates an authorized invoice using the included payload that can be used in a transaction page flow._
```bash
  curl --location --request POST 'http://0.0.0.0:7000/authorize-invoice' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "account_id": "PAYER_TILIA_ACCOUNT_ID",
      "is_escrow": false,
      "invoice_mechanism": "widget",
      "reference_type": "MY_REFERENCE_TYPE_STRING",
      "reference_id": "MY_REFERENCE_ID_STRING",
      "line_items": [
          {
            "description": "ITEM_DESCRIPTION",
            "product_sku": "ITEM_SKU",
            "transaction_type": "user_to_user",
            "currency": "CURRENCY_CODE",
            "amount": 1,
            "recipients": [
              {
                "amount": 1,
                "currency": "CURRENCY_CODE",
                "destination_wallet_id": "PAYEE_WALLET_ID"
              }
            ]
          }
      ]
  }'
```