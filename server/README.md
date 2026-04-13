# Server MVC structure

Use the root `server/` directory for Nuxt/Nitro backend code.

- `server/api/` - route handlers only
- `server/controllers/` - request/response orchestration
- `server/services/` - business logic
- `server/repositories/` - database access
- `server/models/` - mongoose schemas/models
- `server/config/` - infrastructure config such as MongoDB connection
- `server/utils/` - shared server helpers


Example flow:
1) `server/api/test.get.js`
2) `server/controllers/testController.js`
3) `server/services/testService.js` 
4) `server/repositories/testRepository.js` 
5) `server/models/Test.js`

Blob test API:
- `POST /api/blob/upload` - upload one image with `multipart/form-data`, field name `file`, optional `folder` field for the blob path prefix
- `GET /api/blob/list` - list uploaded files from the appeal blob root folder
- `DELETE /api/blob/delete?url=<blob-url>` - delete a file by blob URL

Recommended appeal storage layout:
- `cityhelp/appeals/<appealId>/photos/*` - user photos during creation
- `cityhelp/appeals/<appealId>/fixed-images/*` - employee result photos
- `cityhelp/appeals/<appealId>/...` - any appeal-specific attachments
