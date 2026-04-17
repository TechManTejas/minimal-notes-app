import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

const NOTES_STORAGE_KEY = "@minimal_notes_app_v1";

function isValidNote(value: unknown): value is Note {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function sortByLatest(notes: Note[]): Note[] {
  return notes.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export class NoteStorage {
  static async getAllNotes(): Promise<Note[]> {
    const raw = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      const validNotes = parsed.filter(isValidNote);
      return sortByLatest(validNotes);
    } catch {
      return [];
    }
  }

  static async getNoteById(noteId: string): Promise<Note | null> {
    const notes = await this.getAllNotes();
    return notes.find((note) => note.id === noteId) ?? null;
  }

  static async saveNote(input: Pick<Note, "id" | "title" | "content">): Promise<void> {
    const notes = await this.getAllNotes();
    const now = new Date().toISOString();
    const normalizedTitle = input.title.trim();
    const normalizedContent = input.content.trim();
    const index = notes.findIndex((note) => note.id === input.id);

    if (index >= 0) {
      notes[index] = {
        ...notes[index],
        title: normalizedTitle,
        content: normalizedContent,
        updatedAt: now,
      };
    } else {
      notes.push({
        id: input.id,
        title: normalizedTitle,
        content: normalizedContent,
        createdAt: now,
        updatedAt: now,
      });
    }

    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sortByLatest(notes)));
  }

  static async createNote(title = "", content = ""): Promise<Note> {
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveNote(note);
    return note;
  }

  static async deleteNote(noteId: string): Promise<void> {
    const notes = await this.getAllNotes();
    const filtered = notes.filter((note) => note.id !== noteId);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filtered));
  }
}
