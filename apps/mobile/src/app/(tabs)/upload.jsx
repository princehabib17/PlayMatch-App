import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Upload, Video, Camera, Image as ImageIcon } from "lucide-react-native";
import { useTheme } from "@/utils/theme";
import GoldButton from "@/components/GoldButton";

export default function UploadScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + theme.spacing.lg,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Header */}
        <Text
          style={[
            theme.typography.h1,
            {
              fontFamily: "Figtree_700Bold",
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
              letterSpacing: theme.typography.h1.letterSpacing,
            },
          ]}
        >
          Upload Highlight
        </Text>

        <Text
          style={[
            theme.typography.body,
            {
              fontFamily: "Inter_500Medium",
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
              lineHeight: theme.typography.body.lineHeight,
            },
          ]}
        >
          Share your best football moments with the PlayMatch community
        </Text>

        {/* Upload Options */}
        <View style={{ gap: theme.spacing.lg }}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.md,
              }}
            >
              <Video
                size={24}
                color={theme.colors.background}
                strokeWidth={2}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                    letterSpacing: theme.typography.h3.letterSpacing,
                  },
                ]}
              >
                Upload Video
              </Text>
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                Share your best goals and skills
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.md,
              }}
            >
              <Camera
                size={24}
                color={theme.colors.background}
                strokeWidth={2}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                    letterSpacing: theme.typography.h3.letterSpacing,
                  },
                ]}
              >
                Record Now
              </Text>
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                Capture the moment live
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.md,
              }}
            >
              <ImageIcon
                size={24}
                color={theme.colors.background}
                strokeWidth={2}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                    letterSpacing: theme.typography.h3.letterSpacing,
                  },
                ]}
              >
                Upload Photo
              </Text>
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                Share match moments and celebrations
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text
            style={[
              theme.typography.caption,
              {
                fontFamily: "Inter_500Medium",
                color: theme.colors.textMuted,
                textAlign: "center",
                letterSpacing: theme.typography.caption.letterSpacing,
              },
            ]}
          >
            Coming soon! Upload feature will be available in the next update.
          </Text>
        </View>
      </View>
    </View>
  );
}
