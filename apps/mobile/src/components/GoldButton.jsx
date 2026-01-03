import React, { useRef } from "react";
import { Text, TouchableOpacity, Animated, View } from "react-native";
import { useTheme } from "@/utils/theme";

export default function GoldButton({
  title,
  onPress,
  icon: Icon,
  variant = "primary",
  disabled = false,
  style,
  ...props
}) {
  const theme = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shimmerValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shimmerValue, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const backgroundColor =
    variant === "primary" ? theme.colors.primary : "transparent";

  const borderColor =
    variant === "outline" ? theme.colors.primary : "transparent";

  const textColor = variant === "primary" ? "#000000" : theme.colors.primary;

  const shimmerOpacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          {
            height: theme.components.buttonHeight,
            backgroundColor: disabled
              ? theme.colors.textMuted
              : backgroundColor,
            borderWidth: variant === "outline" ? 2 : 0,
            borderColor: disabled ? theme.colors.textMuted : borderColor,
            borderRadius: theme.radius.round,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing.xl,
            position: "relative",
            overflow: "hidden",
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        {...props}
      >
        {/* Shimmer overlay */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFF",
            opacity: shimmerOpacity,
          }}
        />

        {Icon && (
          <Icon
            size={theme.components.iconSize}
            color={disabled ? theme.colors.background : textColor}
            strokeWidth={2}
            style={{ marginRight: title ? theme.spacing.sm : 0 }}
          />
        )}

        {title && (
          <Text
            style={[
              theme.typography.body,
              {
                fontFamily: "Figtree_700Bold",
                color: disabled ? theme.colors.background : textColor,
                letterSpacing: theme.typography.body.letterSpacing,
              },
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
