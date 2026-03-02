# REST API Documentation

## BASE URL

`http://localhost:5000/api`

## SONG ENDPOINT

Base Url: `/songs`

    Headers:
    - Authorization: Bearer token

> #### **All Song**

endpoint: `GET /`

    Required:
    - Admin

Response Success:

```json
{
  "success": true,
  "message": "Songs retrieve success",
  "data": [
    {
      "_id": "699329c5c120d3696acb41ad",
      "title": "Rebound 3",
      "performer": "QWER",
      "writer": "Daily, Likey, Pop Time, SOYEON",
      "publisher": "TAMAGO PRODUCTION",
      "imageUrl": "https://res.cloudinary.com/dc4k7fypt/image/upload/v1771252164/qfkhriw4g6921nngisbl.jpg",
      "audioUrl": "https://res.cloudinary.com/dc4k7fypt/video/upload/v1771252163/xrjjs5keorgovfancvfv.mp3",
      "genre": [
        "6991da9d756012777bb5b626",
        "6991da9d756012777bb5b627",
        "6991da9d756012777bb5b63c"
      ],
      "duration": 188,
      "releaseYear": 2024,
      "createdBy": "6989a20c0c14df435298c7a5",
      "played": 0,
      "createdAt": "2026-02-16T14:29:25.807Z",
      "updatedAt": "2026-02-16T14:29:25.807Z",
      "__v": 0
    }
  ]
}
```

Response Failed:

```json
{
  "success": false,
  "message": "Song retrieve failed"
}
```

> #### **Get Song By ID**

endpoint: `GET /:id`

Response Success:

```json
{
  "success": true,
  "message": "Song retrieve success",
  "data": {
    "_id": "699329c5c120d3696acb41ad",
    "title": "Rebound 3",
    "performer": "QWER",
    "writer": "Daily, Likey, Pop Time, SOYEON",
    "publisher": "TAMAGO PRODUCTION",
    "imageUrl": "https://res.cloudinary.com/dc4k7fypt/image/upload/v1771252164/qfkhriw4g6921nngisbl.jpg",
    "audioUrl": "https://res.cloudinary.com/dc4k7fypt/video/upload/v1771252163/xrjjs5keorgovfancvfv.mp3",
    "genre": [
      "6991da9d756012777bb5b626",
      "6991da9d756012777bb5b627",
      "6991da9d756012777bb5b63c"
    ],
    "duration": 188,
    "releaseYear": 2024,
    "createdBy": "6989a20c0c14df435298c7a5",
    "played": 0,
    "createdAt": "2026-02-16T14:29:25.807Z",
    "updatedAt": "2026-02-16T14:29:25.807Z",
    "__v": 0
  }
}
```

Response Failed:

```json
{
  "success": false,
  "message": "Song retrieve failed"
}
```

> #### **Featured Songs, Trending Songs, Made For You Song**

endpoint featured: `GET /featured`

endpoint trending: `GET /trending`

endpoint made for you: `GET /made-for-you`

Response Success:

```json
{
  "success": true,
  "message": "<Featured/Trending/Made For You> retrieve success",
  "data": [
    {
      "_id": "6991de93ff6b42b551c14159",
      "title": "My Name Is Malgeum",
      "imageUrl": "https://res.cloudinary.com/dc4k7fypt/image/upload/v1771167378/kuq8ihfwoba60v131hwm.jpg"
    },
    {
      "_id": "6993293dc120d3696acb41a5",
      "title": "Rebound",
      "imageUrl": "https://res.cloudinary.com/dc4k7fypt/image/upload/v1771252028/lijjw0wuvuy0pyy2mvtg.jpg"
    }
  ]
}
```

Response Failed:

```json
{
  "success": false,
  "message": "<Featured/Trending/Made For You> songs retrieve failed"
}
```

> #### **Create Song**

endpoint: `POST /`

    Request File:
    - imageFile (required)
    - audioFile (required)

Request Body:

```json
{
  "title": "Youth Promise",
  "performer": "QWER",
  "writer": "Chodan, Magente, Hina, Siyeon",
  "publisher": "TAMAGO PRODUCTION",
  "duration": 188,
  "releaseYear": 2025,
  "genre": [123, 456, 789]
}
```

Response Success:

```json
{
  "success": true,
  "message": "Song upload success",
  "data": {
    "title": "Youth Promise",
    "performer": "QWER",
    "writer": "Chodan, Magenta, Hina, Siyeon",
    "publisher": "TAMAGO PRODUCTION",
    "imageUrl": "https://res.cloudinary.com/dc4k7fypt/image/upload/v1771255089/x6y6r8fmyzzhylj1o8op.jpg",
    "audioUrl": "https://res.cloudinary.com/dc4k7fypt/video/upload/v1771255086/xmhqjdfxz7zhhnsxfhmi.mp3",
    "genre": [
      "6991da9d756012777bb5b626",
      "6991da9d756012777bb5b627",
      "6991da9d756012777bb5b63c"
    ],
    "duration": 188,
    "releaseYear": 2025,
    "createdBy": "6989a20c0c14df435298c7a5",
    "played": 0,
    "_id": "699335328b3d70734ca6121d",
    "createdAt": "2026-02-16T15:18:10.489Z",
    "updatedAt": "2026-02-16T15:18:10.489Z",
    "__v": 0
  }
}
```

Response Failed:

```json
{
  "success": false,
  "message": "Song upload failed"
}
```


> #### **Update Song**

endpoint: `PATCH /:id`

    Request File:
    - imageFile (optional)
    - audioFile (optional)

Request Body: (optional)

```json
{
  "title": "Youth Promise",
  "performer": "QWER",
  "writer": "Chodan, Magente, Hina, Siyeon",
  "publisher": "TAMAGO PRODUCTION",
  "duration": 188,
  "releaseYear": 2025,
  "genre": [123, 456, 789]
}
```

Response Success:

```json
{
  "success": true,
  "message": "Song update success",
  "data": {
    "title": "Youth Promise",
    "performer": "QWER",
    "writer": "Chodan, Magenta, Hina, Siyeon",
    "publisher": "TAMAGO PRODUCTION",
    "imageUrl": "https://res.cloudinary.com/dc4k7fypt/image/upload/v1771255089/x6y6r8fmyzzhylj1o8op.jpg",
    "audioUrl": "https://res.cloudinary.com/dc4k7fypt/video/upload/v1771255086/xmhqjdfxz7zhhnsxfhmi.mp3",
    "genre": [
      "6991da9d756012777bb5b626",
      "6991da9d756012777bb5b627",
      "6991da9d756012777bb5b63c"
    ],
    "duration": 188,
    "releaseYear": 2025,
    "createdBy": "6989a20c0c14df435298c7a5",
    "played": 0,
    "_id": "699335328b3d70734ca6121d",
    "createdAt": "2026-02-16T15:18:10.489Z",
    "updatedAt": "2026-02-16T15:18:10.489Z",
    "__v": 0
  }
}
```

Response Failed:

```json
{
  "success": false,
  "message": "Song update failed"
}
```


> #### **Delete Song**

endpoint: `DELETE /:id`

Response Success:

```json
{
  "success": true,
  "message": "Song delete success",
}
```

Response Failed:

```json
{
  "success": false,
  "message": "Song delete failed"
}
```