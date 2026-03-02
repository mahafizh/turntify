export interface Genre {
  _id: string;
  title: string;
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
  album: string | null;
  played: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SongPreview = Pick<
  Song,
  "_id" | "title" | "performer" | "duration"
>;

export interface PlaylistSong {
  _id: string;
  addedBy: string;
  addedAt: Date;
  song: SongPreview;
}

export interface Playlist {
  _id: string;
  title: string;
  visiblity: "public" | "private";
  createdBy: string;
  collaborators: string[];
  imageUrl: string;
  songs: PlaylistSong[];
  description: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  _id: string;
  title: string;
  visiblity: "public" | "private";
  type: "album" | "ep" | "single";
  createdBy: string;
  imageUrl: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  songs: Song[];
}

export interface Collection {
  _id: string;
  title: string;
  creator: string;
  type: "album" | "playlist";
  imageUrl: string;
}

export interface CollectionSong {
  _id: string;
  title: string;
  performer: string;
  duration: number;
  played: number;
  addedBy?: string
  createdAt: Date;
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
  collaborators?: string;
  description?: string;
  duration: number;
  imageUrl: string;
  songs: CollectionSong[];
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
