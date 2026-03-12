# Authentication Information

## Admin Pages

Pages that are placed in the `admin` directory will automatically redirect the user to the login screen if they are not logged in. Once the user logs in, they will be redirected back to the page they were trying to access.

If a logged-in user is not an administrator and tries to access a page in the `admin` directory, they will be redirected to the home page.

To make a user an administrator, the `isAdministrator` field in the `users` collection in the database must be set to `true`. You can do this in MongoDB Compass locally.

## Authenticated Pages

Pages that are placed in the `(authenticated)` directory will automatically redirect the user to the login screen if they are not logged in. Once the user logs in, they will be redirected back to the page they were trying to access. 

## Unauthenticated Pages

Pages that do not require user authentication can be placed anywhere else.
