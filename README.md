# Similar Manga

Finds similar titles based on content tags. [Live API](https://mimas.mantton.com).

## Current Supported Sources

- [MangaDex](https://mangadex.org) [28,000 entries]

## Endpoints

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/similar/{SOURCE_ID}/{CONTENT_ID}/{PAGE}`                             | Retrieves Similar titles for provided conent.                     |
| `GET`    | `/sources`                             | Retrieve all valid sources                      |
