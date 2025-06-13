import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

// TYPES
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
}

// TOKEN
const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
console.log("🔑 NOTEHUB_TOKEN:", NOTEHUB_TOKEN);

// AXIOS INSTANCE (без токена тут)
const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

// Додаємо токен до кожного запиту через інтерцептор
axiosInstance.interceptors.request.use((config) => {
  if (NOTEHUB_TOKEN) {
    config.headers.Authorization = `Bearer ${NOTEHUB_TOKEN}`;
  } else {
    console.warn("⚠️ NOTEHUB_TOKEN is missing");
  }
  return config;
});

// GET
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

// POST
export async function createNote(newNote: NewNoteData): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", newNote);
  return response.data;
}

// DELETE
export async function deleteNote(noteId: number): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
}
