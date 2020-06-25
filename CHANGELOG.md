- Documented the strange but official behavior of the Google Sheets append API, which detects the "last table" in your sheet and appends rows there, sometimes in a surprising column.

## 1.0.4, 2020-07-01

- Documentation was incorrect re: where to put `credentials.json`. Because this module uses `improve`, it should go in the project level `lib/modules/apostrophe-forms/credentials.json` file, not `lib/modules/apostrophe-forms-submit-google/credentials.json`.
- Previously this module broke project level use of `addFields` for `apostrophe-forms`. This has been fixed.

## 1.0.3, 2020-06-17

- Works properly when no sheet name is specified.

- If an error does occur and no user is logged in, logs properly rather than failing to use `apos.notify`.

## 1.0.2, 2019-07-24

- Adds error handling so failed Google Sheet submissions don't throw client errors, but do provide notifications for logged-in users. Also no longer uses the English-centric "Sheet1" as the default sheet name, but looks for the first sheet in the spreadsheet if none is provide.
