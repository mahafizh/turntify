export interface Genre {
  _id: string;
  title: string;
}

export interface Friend {
  _id: string;
  fullName: string;
  imageUrl: string;
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalListeners: number;
}

export interface Album {
  _id: string;
  title: string;
  visibility: "private" | "public";
  type: "ep" | "single" | "album";
  songs: Song[];
  createdBy: User;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  _id: string;
  title: string;
  visibility: "private" | "public";
  createdBy: Pick<User, "fullName" | "_id">;
  collaborators: Pick<User, "fullName" | "_id">;
  imageUrl: string;
  songs: {
    _id: string;
    song: Song[] | string;
    addedBy: string;
    addedAt: Date;
  };
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Song {
  _id: string;
  title: string;
  performer: string;
  writer: string;
  publisher: string;
  audioUrl: string;
  genre: Genre[];
  duration: number;
  releaseYear: number;
  createdBy: User;
  album: Album | null;
  played: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  addedBy: string | null;
}

export interface Collection {
  _id: string;
  title: string;
  creator: string;
  type: "album" | "playlist";
  visibility: "private" | "public";
  createdAt: string;
  imageUrl: string;
}

export interface CollectionUser {
  _id: string;
  imageUrl: string;
  fullName: string;
}

export interface CurrentCollection {
  _id: string;
  title: string;
  visibility: "private" | "public";
  type?: "ep" | "album" | "single";
  collection: "album" | "playlist";
  createdBy: CollectionUser;
  createdAt: string;
  collaborators?: CollectionUser;
  description?: string;
  duration: number;
  imageUrl: string;
  songs: Song[];
}

export interface User {
  _id: string;
  fullName: string;
  imageUrl: string;
  friends: Friend[];
  savedAlbums: Album[];
  playlists: Playlist[];
  likedSongs: Song[];
  createdAt: Date;
  updatedAt: Date;
}
