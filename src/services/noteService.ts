import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

//TYPES
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
}

//TOKEN CHECK
const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
if (!NOTEHUB_TOKEN) {
  throw new Error("TOKEN IS MISSING");
}

//AXIOS DEFAULTS
const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});

//GET
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

//POST
export async function createNote(newNote: NewNoteData): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", newNote);
  return response.data;
}

//DELETE
export async function deleteNote(noteId: number): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
}