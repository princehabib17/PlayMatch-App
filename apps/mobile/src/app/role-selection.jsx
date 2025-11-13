import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Users, UserCheck } from "lucide-react-native";
import { useTheme } from "@/utils/theme";

export default function RoleSelectionScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState(null);

  const playerPulseAnimation = useRef(new Animated.Value(0)).current;
  const organizerPulseAnimation = useRef(new Animated.Value(0)).current;

  const handleRolePress = (role) => {
    setSelectedRole(role);

    // Pulse animation
    const pulseAnimation =
      role === "player" ? playerPulseAnimation : organizerPulseAnimation;

    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to main app
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 500);
  };

  const createPulseStyle = (pulseAnimation) => {
    const pulse = pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

    const glowOpacity = pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.6],
    });

    return {
      transform: [{ scale: pulse }],
      shadowOpacity: glowOpacity,
    };
  };

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

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + theme.spacing.xxl,
          paddingBottom: insets.bottom + theme.spacing.xl,
          paddingHorizontal: theme.spacing.xl,
        }}
      >
        {/* Header */}
        <View
          style={{ alignItems: "center", marginBottom: theme.spacing.xxl * 2 }}
        >
          <Text
            style={[
              theme.typography.h1,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.text,
                textAlign: "center",
                letterSpacing: theme.typography.h1.letterSpacing,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            Join the Game
          </Text>

          <Text
            style={[
              theme.typography.body,
              {
                fontFamily: "Inter_500Medium",
                color: theme.colors.textSecondary,
                textAlign: "center",
              },
            ]}
          >
            Choose your role to get started
          </Text>
        </View>

        {/* Role Cards */}
        <View
          style={{ flex: 1, justifyContent: "center", gap: theme.spacing.xl }}
        >
          {/* Player Card */}
          <Animated.View style={createPulseStyle(playerPulseAnimation)}>
            <TouchableOpacity
              onPress={() => handleRolePress("player")}
              activeOpacity={0.9}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 2,
                borderColor: theme.colors.primary,
                padding: theme.spacing.xl,
                alignItems: "center",
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              {/* Icon Container */}
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: theme.spacing.lg,
                }}
              >
                <Users
                  size={40}
                  color={theme.colors.background}
                  strokeWidth={2}
                />
              </View>

              <Text
                style={[
                  theme.typography.h2,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    textAlign: "center",
                    letterSpacing: theme.typography.h2.letterSpacing,
                    marginBottom: theme.spacing.sm,
                  },
                ]}
              >
                Player
              </Text>

              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    lineHeight: theme.typography.body.lineHeight,
                  },
                ]}
              >
                Find and join football games in Manila. Connect with players and
                showcase your skills.
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Organizer Card */}
          <Animated.View style={createPulseStyle(organizerPulseAnimation)}>
            <TouchableOpacity
              onPress={() => handleRolePress("organizer")}
              activeOpacity={0.9}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 2,
                borderColor: theme.colors.primary,
                padding: theme.spacing.xl,
                alignItems: "center",
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              {/* Icon Container */}
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: theme.spacing.lg,
                }}
              >
                <UserCheck
                  size={40}
                  color={theme.colors.background}
                  strokeWidth={2}
                />
              </View>

              <Text
                style={[
                  theme.typography.h2,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    textAlign: "center",
                    letterSpacing: theme.typography.h2.letterSpacing,
                    marginBottom: theme.spacing.sm,
                  },
                ]}
              >
                Organizer
              </Text>

              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    lineHeight: theme.typography.body.lineHeight,
                  },
                ]}
              >
                Create and manage football games. Build your community and earn
                revenue.
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", marginTop: theme.spacing.xl }}>
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
            You can always change your role later in settings
          </Text>
        </View>
      </View>
    </View>
  );
}
