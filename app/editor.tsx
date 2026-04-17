import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NoteStorage } from "../storage/noteStorage";
import { Note } from "../types/note";

export default function EditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const noteId = useMemo(() => (Array.isArray(params.id) ? params.id[0] : params.id), [params.id]);

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!noteId) {
        setDidLoad(true);
        return;
      }

      const existing = await NoteStorage.getNoteById(noteId);
      if (!existing) {
        Alert.alert("Missing note", "This note no longer exists.");
        router.back();
        return;
      }

      setNote(existing);
      setTitle(existing.title);
      setContent(existing.content);
      setDidLoad(true);
    };

    load();
  }, [noteId, router]);

  const canSave = title.trim().length > 0 || content.trim().length > 0;

  const saveCurrent = useCallback(async () => {
    if (!canSave) {
      return;
    }

    if (note) {
      await NoteStorage.saveNote({
        id: note.id,
        title,
        content,
      });
      return;
    }

    const created = await NoteStorage.createNote(title, content);
    setNote(created);
    router.replace({ pathname: "/editor", params: { id: created.id } });
  }, [canSave, content, note, router, title]);

  useEffect(() => {
    if (!didLoad || !canSave) {
      return;
    }

    const timeout = setTimeout(() => {
      saveCurrent();
    }, 900);

    return () => clearTimeout(timeout);
  }, [canSave, didLoad, saveCurrent, title, content]);

  const onPressSave = async () => {
    if (!canSave) {
      Alert.alert("Empty note", "Add a title or content before saving.");
      return;
    }

    await saveCurrent();
    router.back();
  };

  const onDelete = () => {
    if (!note) {
      return;
    }

    Alert.alert("Delete note", "This note will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await NoteStorage.deleteNote(note.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.headerAction}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{note ? "Edit Note" : "New Note"}</Text>
          <Pressable onPress={onPressSave}>
            <Text style={[styles.headerAction, !canSave && styles.headerActionDisabled]}>
              Save
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
          <TextInput
            placeholder="Title"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
            maxLength={120}
          />
          <TextInput
            placeholder="Write your note..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            style={styles.contentInput}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {note ? (
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete Note</Text>
          </Pressable>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eceef4",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  headerAction: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600",
  },
  headerActionDisabled: {
    opacity: 0.45,
  },
  form: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    paddingVertical: 10,
  },
  contentInput: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 24,
    color: "#1f2937",
    minHeight: 300,
    paddingVertical: 8,
  },
  deleteButton: {
    marginHorizontal: 18,
    marginBottom: 22,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
