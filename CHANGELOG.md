# Changelog

## 1.1.2, 2023-06-06

- Removes `apostrophe` as a peer dependency.

## 1.1.1, 2020-08-26

- Uses the latest version of Google's API module (59.0.0). Compatibility has been verified.

## 1.1.0, 2020-07-01

- Documented how to override Google's automatic guesses that can result in the loss of leading zeroes from phone numbers.
- Documented the strange but official behavior of the Google Sheets append API, which detects the "last table" in your sheet and appends rows there, sometimes in a surprising column.
- Documentation was incorrect re: where to put `credentials.json`. Because this module uses `improve`, it should go in the project level `lib/modules/apostrophe-forms/credentials.json` file, not `lib/modules/apostrophe-forms-submit-google/credentials.json`.
- Previously this module broke project level use of `addFields` for `apostrophe-forms`. This has been fixed.
- "Date Submitted" and "Time Submitted" fields are now automatically added to the row inserted in Google Sheets.
- An `apostrophe-forms-submit-google:before` event is now emitted just before submission to google, receiving `(req, forms, data)` as arguments. This allows a chance to modify `data` first.

## 1.0.3, 2020-06-17

- Works properly when no sheet name is specified.

- If an error does occur and no user is logged in, logs properly rather than failing to use `apos.notify`.

## 1.0.2, 2019-07-24

- Adds error handling so failed Google Sheet submissions don't throw client errors, but do provide notifications for logged-in users. Also no longer uses the English-centric "Sheet1" as the default sheet name, but looks for the first sheet in the spreadsheet if none is provide.
