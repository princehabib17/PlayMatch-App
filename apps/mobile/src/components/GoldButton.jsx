import React, { useRef, useEffect } from "react";
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
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!disabled && variant === "primary") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowPulse, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [disabled, variant]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor =
    variant === "primary" ? theme.colors.primary : "transparent";

  const borderColor =
    variant === "outline" ? theme.colors.primary : theme.colors.border;

  const textColor = variant === "primary" ? theme.colors.textBlack : theme.colors.primary;

  const glowIntensity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
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
              ? theme.colors.cardElevated
              : backgroundColor,
            borderWidth: variant === "outline" ? 2.5 : 0,
            borderColor: disabled ? theme.colors.borderSubtle : borderColor,
            borderRadius: theme.radius.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: theme.spacing.xl,
            position: "relative",
            overflow: "hidden",
            ...(variant === "primary" && !disabled ? theme.shadows.glowStrong : {}),
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        {...props}
      >
        {/* Diagonal accent */}
        {variant === "primary" && !disabled && (
          <>
            <View
              style={{
                position: "absolute",
                width: 3,
                height: "100%",
                backgroundColor: theme.colors.textBlack,
                left: 0,
                opacity: 0.2,
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 60,
                height: 3,
                backgroundColor: theme.colors.textBlack,
                top: 0,
                right: 20,
                transform: [{ rotate: "-12deg" }],
                opacity: 0.15,
              }}
            />
          </>
        )}

        {/* Animated glow overlay for primary variant */}
        {variant === "primary" && !disabled && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#FFFFFF",
              opacity: glowIntensity,
              mixBlendMode: "overlay",
            }}
          />
        )}

        {Icon && (
          <Icon
            size={theme.components.iconSize}
            color={disabled ? theme.colors.textMuted : textColor}
            strokeWidth={2.5}
            style={{ marginRight: title ? theme.spacing.sm : 0 }}
          />
        )}

        {title && (
          <Text
            style={[
              theme.typography.h4,
              {
                fontFamily: "Oswald_700Bold",
                color: disabled ? theme.colors.textMuted : textColor,
              },
            ]}
          >
            {title.toUpperCase()}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
