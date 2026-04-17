import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: "#f5f7fb",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Minimal Notes",
          }}
        />
        <Stack.Screen
          name="editor"
          options={{
            title: "Edit Note",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
