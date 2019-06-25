# Apostrophe Forms Google Sheets Submission

For use with ApostropheCMS 2.x. Requires Node v8.

## Usage
1. Create API project
   1. Create service account API credentials
   2. Save the credentials JSON file somewhere safe, and in the module as `credentials.json`
   3. Copy the service account email address.
   4. Plan for the service account credentials to expire in 10 years.
2. Create the spreadsheet
   1. Column headers must match the Google form field *names* (not the field labels), or else the module will add new columns.
3. Configure the module