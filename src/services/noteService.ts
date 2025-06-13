import axios from "axios";
import type { Note, NewNoteData } from "../types/note";


interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
}


const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
console.log("🔑 NOTEHUB_TOKEN:", NOTEHUB_TOKEN);


const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});


axiosInstance.interceptors.request.use((config) => {
  if (NOTEHUB_TOKEN) {
    config.headers.Authorization = `Bearer ${NOTEHUB_TOKEN}`;
  } else {
    console.warn("⚠️ NOTEHUB_TOKEN is missing");
  }
  return config;
});


export async function fetchNotes(
  query: string,
  page: number
): Promise<FetchNotesResponse> {
  const params: FetchNotesParams = {
    ...(query.trim() !== "" && { search: query.trim() }),
    page: page,
    perPage: 12,
  };

  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params,
  });
  return response.data;
}


export async function createNote(newNote: NewNoteData): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", newNote);
  return response.data;
}


export async function deleteNote(noteId: number): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
}
