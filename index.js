const { google } = require('googleapis');
const fs = require('fs');

module.exports = {
  improve: 'apostrophe-forms',
  addFields: [
    {
      name: 'googleSheetSubmissions',
      label: 'Submit to Google Spreadsheets',
      type: 'boolean',
      choices: [
        {
          label: 'Yes',
          value: true,
          showFields: [ 'googleSpreadsheetId', 'googleSheetName' ]
        }
      ]
    },
    {
      name: 'googleSpreadsheetId',
      label: 'Google Spreadsheet ID',
      type: 'string',
      required: true,
      htmlHelp: '<a href="https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id">The ID is found in the spreadsheet URL</a>: https://docs.google.com/spreadsheets/d/<strong>spreadsheetId</strong>/edit#gid=0'
    },
    {
      name: 'googleSheetName',
      label: 'Google Spreadsheet Sheet Name',
      type: 'string',
      htmlHelp: 'The name of the sheet tab in your Google spreadsheet. If not provided, this is assumed to be "Sheet1", the default initial sheet name.'
    }
  ],
  construct: function (self, options) {
    options.arrangeFields = options.arrangeFields.map(group => {
      if (group.name === 'afterSubmit') {
        group.fields.push(
          'googleSheetSubmissions',
          'googleSpreadsheetId',
          'googleSheetName'
        );
      }
      return group;
    });

    self.sendToGoogle = async function (req, form, data) {
      if (form.googleSheetSubmissions === true) {
        const target = {
          spreadsheetId: form.googleSpreadsheetId,
          sheetName: form.googleSheetName || 'Sheet1'
        };

        // Get the header row titles.
        const header = await getHeaderRow(target);

        // Rework form submission data to match headers. If no column exists for a form value, add it.
        const liveColumns = [...header];
        const newRow = [];

        header.forEach(column => {
          formatData(data, column);

          newRow.push(data[column] || '');

          delete data[column];
        });

        // Add a column header for any data properties left-over.
        for (const key in data) {
          formatData(data, key);

          header.push(key);
          newRow.push(data[key]);
        }

        // Update the spreadsheet header if necessary.
        if (liveColumns.length !== header.length) {
          await updateHeader(header, target);
        }
        // Make post request to the google sheet.
        await appendSubmission(newRow, target);
      }
    };

    function formatData(data, key) {
      if (Array.isArray(data[key])) {
        data[key] = data[key].join(',');
      }

      data[key] = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
    }

    async function getHeaderRow(target) {
      const headerRes = await self.sheets.spreadsheets.values.get({
        spreadsheetId: target.spreadsheetId,
        majorDimension: 'ROWS',
        range: `${target.sheetName}!1:1`
      });

      return headerRes.data.values ? headerRes.data.values[0] : [];
    }

    async function updateHeader(newHeader, target) {
      return self.sheets.spreadsheets.values.update({
        spreadsheetId: target.spreadsheetId,
        range: `${target.sheetName}!1:1`,
        valueInputOption: 'RAW',
        responseDateTimeRenderOption: 'FORMATTED_STRING',
        resource: {
          "range": `${target.sheetName}!1:1`,
          "majorDimension": 'ROWS',
          "values": [
            newHeader
          ]
        }
      });
    }

    async function appendSubmission(newRow, target) {
      await self.sheets.spreadsheets.values.append({
        spreadsheetId: target.spreadsheetId,
        range: `${target.sheetName}`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        responseDateTimeRenderOption: 'FORMATTED_STRING',
        resource: {
          values: [
            newRow
          ]
        }
      });
    }
  },
  afterConstruct: async function (self) {
    // Set the environment variable for API auth.
    const confFolder = self.__meta.chain[self.__meta.chain.length - 1].dirname;
    let credentialsFile;

    if (fs.existsSync(`${confFolder}/credentials.json`)) {
      credentialsFile = `${confFolder}/credentials.json`;
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      credentialsFile;

    let auth;

    if (
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      process.env.GOOGLE_APPLICATION_CREDENTIALS !== 'undefined'
    ) {
      try {
        // Make google auth connection.
        auth = await google.auth.getClient({
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
      } catch (error) {
        self.apos.utils.error('⚠️ Google Authentication Error: ', error);
        return;
      }

      self.sheets = google.sheets({ version: 'v4', auth });
    } else {
      self.apos.utils.warnDev('⚠️  No credentials found for apostrophe-forms-submit-google.');
    }

    if (auth) {
      self.on('submission', 'googleSheetSubmission', self.sendToGoogle);
    }
  }
};
