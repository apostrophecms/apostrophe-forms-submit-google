const { google } = require('googleapis');

module.exports = {
  improve: 'apostrophe-forms',
  construct: async function (self, options) {
    // Get ENV variables for API auth.

    self.on('submission', 'googleSheetSubmission', async function (req, form, data) {
      if (form.googleSheetSubmissions === 'true') {
        // Make google auth connection.

        // Check if we have any rows yet and get the header row titles.

        // If no rows, add the headers as well.

        // Rework form submission data to match headers. If no column exists for a form value, add it.

        // Make post request to the google sheet.
      }
    });
  }
};
