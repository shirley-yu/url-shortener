# URL Shortener API

### User Stories

1. I can POST a URL to `sy-shorturl.herokuapp.com/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"https://www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.<domain_name>.<extension>(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`.
3. When I visit the shortened URL, it will redirect me to my original link.

#### Creation Example:

POST sy-shorturl.herokuapp.com/new - body (urlencoded) : url=https://www.google.com

#### Usage:

sy-shorturl.herokuapp.com/1

#### Will redirect to:

https://www.google.com
