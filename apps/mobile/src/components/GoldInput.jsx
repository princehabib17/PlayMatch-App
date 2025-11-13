import React, { useRef, useState } from "react";
import { View, Text, TextInput, Animated } from "react-native";
import { useTheme } from "@/utils/theme";

export default function GoldInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
  ...props
}) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const underlineAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(underlineAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(underlineAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const underlineWidth = underlineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text
          style={[
            theme.typography.caption,
            {
              fontFamily: "Inter_500Medium",
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.sm,
              letterSpacing: theme.typography.caption.letterSpacing,
              textTransform: "uppercase",
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View style={{ position: "relative" }}>
        <TextInput
          style={[
            theme.typography.body,
            {
              fontFamily: "Inter_500Medium",
              color: theme.colors.text,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: 0,
              backgroundColor: "transparent",
              borderWidth: 0,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.textMuted,
              minHeight: multiline ? 80 : "auto",
              textAlignVertical: multiline ? "top" : "center",
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          multiline={multiline}
          {...props}
        />

        {/* Animated gold underline */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            width: underlineWidth,
            backgroundColor: theme.colors.primary,
          }}
        />
      </View>
    </View>
  );
}
