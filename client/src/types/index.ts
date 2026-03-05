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
  createdBy: string;
  album: string | null;
  played: number;
  createdAt: Date;
  updatedAt: Date;
  addedBy: string | null;
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
  collaborators?: string;
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
