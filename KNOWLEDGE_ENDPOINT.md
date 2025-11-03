# Knowledge Endpoint Documentation

The `/knowledge` endpoint allows you to upload, list, and delete document files (.pdf and .docx) to a temporary storage folder.

## Configuration

Add this to your `.env` file (optional):

```env
UPLOAD_TEMP_DIR=/path/to/your/temp/folder
```

If not specified, the default location is `./temp-uploads` in the project root.

## Authentication

All endpoints require an API key via the `Authorization` header.

## Endpoints

### 1. Upload Documents

**POST** `/knowledge`

Upload one or more document files (.pdf or .docx).

**Headers:**
- `Authorization`: Your API key
- `Content-Type`: `multipart/form-data`

**Request:**
- Form data with one or more file fields
- Supported file types: `.pdf`, `.docx`
- Max file size: 50 MB per file
- Max files per request: 10

**Example using curl:**

```bash
# Upload a single file
curl -X POST http://localhost:3000/knowledge \
  -H "Authorization: your-api-key" \
  -F "file=@document.pdf"

# Upload multiple files
curl -X POST http://localhost:3000/knowledge \
  -H "Authorization: your-api-key" \
  -F "file1=@document1.pdf" \
  -F "file2=@document2.docx"
```

**Example using JavaScript/Fetch:**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/knowledge', {
  method: 'POST',
  headers: {
    'Authorization': 'your-api-key',
  },
  body: formData,
});

const result = await response.json();
console.log(result);
```

**Success Response (201):**

```json
{
  "message": "Successfully uploaded 2 file(s)",
  "files": [
    {
      "fileId": "123e4567-e89b-12d3-a456-426614174000",
      "filename": "document1.pdf",
      "path": "/path/to/temp-uploads/123e4567-e89b-12d3-a456-426614174000.pdf",
      "size": 102400
    },
    {
      "fileId": "987e6543-e21b-34d5-b678-426614174111",
      "filename": "document2.docx",
      "path": "/path/to/temp-uploads/987e6543-e21b-34d5-b678-426614174111.docx",
      "size": 204800
    }
  ]
}
```

**Error Response (400):**

```json
{
  "error": "Invalid file type. Only .pdf and .docx files are allowed. Received: image.png (image/png)"
}
```

---

### 2. List All Documents

**GET** `/knowledge`

List all uploaded documents in the temporary storage.

**Headers:**
- `Authorization`: Your API key

**Example using curl:**

```bash
curl -X GET http://localhost:3000/knowledge \
  -H "Authorization: your-api-key"
```

**Success Response (200):**

```json
{
  "message": "Found 2 file(s)",
  "files": [
    {
      "fileId": "123e4567-e89b-12d3-a456-426614174000",
      "filename": "123e4567-e89b-12d3-a456-426614174000.pdf",
      "path": "/path/to/temp-uploads/123e4567-e89b-12d3-a456-426614174000.pdf"
    },
    {
      "fileId": "987e6543-e21b-34d5-b678-426614174111",
      "filename": "987e6543-e21b-34d5-b678-426614174111.docx",
      "path": "/path/to/temp-uploads/987e6543-e21b-34d5-b678-426614174111.docx"
    }
  ]
}
```

---

### 3. Delete Documents

**DELETE** `/knowledge`

Delete one or more documents by their file IDs.

**Headers:**
- `Authorization`: Your API key
- `Content-Type`: `application/json`

**Request Body:**

```json
{
  "fileIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "987e6543-e21b-34d5-b678-426614174111"
  ]
}
```

**Example using curl:**

```bash
curl -X DELETE http://localhost:3000/knowledge \
  -H "Authorization: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "fileIds": [
      "123e4567-e89b-12d3-a456-426614174000",
      "987e6543-e21b-34d5-b678-426614174111"
    ]
  }'
```

**Example using JavaScript/Fetch:**

```javascript
const response = await fetch('http://localhost:3000/knowledge', {
  method: 'DELETE',
  headers: {
    'Authorization': 'your-api-key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fileIds: [
      '123e4567-e89b-12d3-a456-426614174000',
      '987e6543-e21b-34d5-b678-426614174111',
    ],
  }),
});

const result = await response.json();
console.log(result);
```

**Success Response (200):**

```json
{
  "message": "Deleted 2 file(s)",
  "deleted": [
    "123e4567-e89b-12d3-a456-426614174000",
    "987e6543-e21b-34d5-b678-426614174111"
  ],
  "failed": []
}
```

**Partial Success Response (200):**

```json
{
  "message": "Deleted 1 file(s)",
  "deleted": [
    "123e4567-e89b-12d3-a456-426614174000"
  ],
  "failed": [
    "987e6543-e21b-34d5-b678-426614174111"
  ]
}
```

**Error Response (400):**

```json
{
  "error": "fileIds array is required and must not be empty"
}
```

---

## File Storage

- Files are stored in the temp directory with UUID-based filenames
- Original file extensions are preserved
- Files persist until explicitly deleted via the DELETE endpoint
- The temp directory is created automatically on first upload

## File Validation

The endpoint validates:
- File extensions (must be `.pdf` or `.docx`)
- MIME types (must be `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- File size (max 50 MB per file)
- Number of files (max 10 per request)

## Notes

- The `fileId` returned from upload should be used for deletion
- Files are stored temporarily and should be processed/moved as needed
- The temp folder is NOT automatically cleaned up - use the DELETE endpoint to remove files
