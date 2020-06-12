# Apostrophe Forms Google Sheets Submission

For use with ApostropheCMS 2.x. Requires Node v8 and `apostrophe-forms v1.x`.

This module adds an additional form submission option to Apostrophe Forms. It allows website managers to configure individual forms to submit to a specific Google spreadsheet. The sheet must exist, but does not necessarily need to be set up with column headings before use. If you wish to set column headings directly (e.g., to set the order of columns yourself), those column headings must exactly match the *field name* from the Apostrophe form.

## Usage

### Create API project

1. Create a project in [the Google Cloud Platform API console](https://console.developers.google.com/apis/dashboard). Enable the Google Sheets API on the project in the API Library.
2. Create an [API service account](https://cloud.google.com/iam/docs/service-accounts) in the Google API Console service.
3. Save the credentials JSON file provided with the new service account. *You may not be able to download this again.* Add this file to the `lib/modules/apostrophe-forms-submit-google` directory in your Apostrophe project as `credentials.json`.
  1. Note: We do not recommend committing this file to version control if your code is public, in which case you should so add it to the `.gitignore file` (for Git) and put it directly on your production server. *Alternately* you can provide the file as JSON in an environment variable named `GOOGLE_APPLICATION_CREDENTIALS`.
4. Copy the service account email address. You will need to add this as an "Edit"-level user on your Google spreadsheet as you would a human editor.
5. Plan for the service account credentials to expire in 10 years. The service account credentials have a long life span, but it is not infinite.

### Create your spreadsheet.

1. This can be done later by CMS users as well. There is help text in the UI directing them to make note of the spreadsheet ID and sheet name.
2. Column headers in the Google spreadsheet must match the form field *names* (not the field labels), or else the module will add new columns to the spreadsheet.

### Configure the module
Enabled the module in your Apostrophe `app.js` file with other modules.

```javascript
// in app.js
modules: {
  // ...,
  'apostrophe-forms': {},
  // ... Other Apostrophe Forms modules and configurations
  'apostrophe-forms-submit-google': {},
}
```

## Change log

### 1.0.2, 2019-07-24

- Adds error handling so failed Google Sheet submissions don't throw client errors, but do provide notifications for logged-in users. Also no longer uses the English-centric "Sheet1" as the default sheet name, but looks for the first sheet in the spreadsheet if none is provide.