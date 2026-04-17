import { Pressable, StyleSheet, Text, View } from "react-native";
import { Note } from "../types/note";

type NoteCardProps = {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress: (note: Note) => void;
};

function previewContent(content: string): string {
  const compact = content.replace(/\s+/g, " ").trim();
  return compact.length > 90 ? `${compact.slice(0, 90)}...` : compact;
}

function formatDate(dateIso: string): string {
  const date = new Date(dateIso);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  return (
    <Pressable
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress(note)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title || "Untitled"}
        </Text>
        <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
      </View>
      <Text style={styles.preview} numberOfLines={2}>
        {previewContent(note.content) || "No content"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e6e8ee",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
});
