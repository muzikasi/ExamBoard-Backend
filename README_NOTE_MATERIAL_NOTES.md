Material note types can now be uploaded without grade/year.

Migration:
  node scripts/migrations/fix-note-years.js

Restart server:
  npm run dev
  # or
  npm start

Curl tests:
  curl -X POST http://localhost:5000/api/materials \
    -H "Authorization: Bearer <TOKEN>" \
    -F "title=Study Tips for Algebra" \
    -F "subject=Math" \
    -F "type=Study tips" \
    -F "file=@/path/to/file.pdf"

  curl -X POST http://localhost:5000/api/materials \
    -H "Authorization: Bearer <TOKEN>" \
    -F "title=Past Exam Biology" \
    -F "subject=Biology" \
    -F "type=Past exam question" \
    -F "grade=grade 11" \
    -F "year[ec]=2023" \
    -F "year[gc]=2023" \
    -F "file=@/path/to/file.pdf"
