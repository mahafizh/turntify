export interface Genre {
  _id: string;
  title: string;
}

export interface Album {
  _id: string;
  title: string;
  visibility: "private" | "public";
  type: "ep" | "single" | "album";
  createdBy: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  _id: string;
  title: string;
  visibility: "private" | "public";
  createdBy: string;
  collaborators: string;
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
  createdBy: string;
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
  imageUrl: string;
}

export interface CollectionUser {
  _id: string;
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
  clerkId: string;
  imageUrl: string;
}

export interface Friend {
  _id: string;
  fullName: string;
  imageUrl: string;
}
