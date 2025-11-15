import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme";
import { useFonts, Figtree_700Bold } from "@expo-google-fonts/figtree";
import { Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    Figtree_700Bold,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.5)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const textSlideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start logo animation
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Start text animation after a slight delay
    setTimeout(() => {
      Animated.timing(textSlideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 300);

    // Rotate animation for the football
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();

    // Auto-redirect after 2 seconds to onboarding
    setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);
  }, []);

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[theme.colors.background, theme.colors.secondary]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: theme.spacing.xl,
        }}
      >
        {/* Animated Football Logo */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnimation }, { rotate: rotation }],
            opacity: fadeAnimation,
            marginBottom: theme.spacing.xxl,
          }}
        >
          {/* Football Icon with Gold Accent */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {/* Football Pattern */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Hexagon Pattern */}
              <View
                style={{
                  width: 24,
                  height: 28,
                  backgroundColor: theme.colors.background,
                  transform: [{ rotate: "30deg" }],
                }}
              />

              {/* Football lines */}
              <View
                style={{
                  position: "absolute",
                  width: 2,
                  height: 60,
                  backgroundColor: theme.colors.background,
                  left: 39,
                  top: 10,
                  borderRadius: 1,
                }}
              />

              <View
                style={{
                  position: "absolute",
                  width: 2,
                  height: 60,
                  backgroundColor: theme.colors.background,
                  left: 39,
                  top: 10,
                  borderRadius: 1,
                  transform: [{ rotate: "60deg" }],
                }}
              />

              <View
                style={{
                  position: "absolute",
                  width: 2,
                  height: 60,
                  backgroundColor: theme.colors.background,
                  left: 39,
                  top: 10,
                  borderRadius: 1,
                  transform: [{ rotate: "120deg" }],
                }}
              />
            </View>
          </View>
        </Animated.View>

        {/* App Title */}
        <Animated.View
          style={{
            transform: [{ translateY: textSlideAnimation }],
            opacity: fadeAnimation,
            alignItems: "center",
          }}
        >
          <Text
            style={[
              theme.typography.h1,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.primary,
                textAlign: "center",
                letterSpacing: theme.typography.h1.letterSpacing,
                marginBottom: theme.spacing.sm,
              },
            ]}
          >
            PlayMatch
          </Text>

          <Text
            style={[
              theme.typography.h2,
              {
                fontFamily: "Inter_600SemiBold",
                color: theme.colors.text,
                textAlign: "center",
                letterSpacing: theme.typography.h2.letterSpacing,
                opacity: 0.8,
              },
            ]}
          >
            Manila
          </Text>

          {/* Tagline */}
          <Text
            style={[
              theme.typography.body,
              {
                fontFamily: "Inter_500Medium",
                color: theme.colors.textSecondary,
                textAlign: "center",
                marginTop: theme.spacing.md,
              },
            ]}
          >
            Discover. Play. Dominate.
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Glow Effect */}
      <LinearGradient
        colors={["transparent", theme.colors.glow]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
        }}
      />
    </View>
  );
}
