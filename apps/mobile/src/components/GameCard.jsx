import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Clock, Users, Trophy, Zap } from "lucide-react-native";
import { useTheme } from "@/utils/theme";

export default function GameCard({
  game,
  onPress,
  variant = "default",
  style,
}) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return theme.colors.success;
      case "Intermediate":
        return theme.colors.warning;
      case "Advanced":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const spotsLeft = game.maxPlayers - game.playersJoined;
  const isAlmostFull = spotsLeft <= 2 && spotsLeft > 0;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          marginBottom: theme.spacing.md,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress && onPress(game)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: isAlmostFull ? theme.colors.warning : theme.colors.border,
          ...theme.shadows.glow,
          position: "relative",
        }}
      >
        {/* Diagonal accent slashes */}
        <View
          style={{
            position: "absolute",
            width: 3,
            height: "100%",
            backgroundColor: theme.colors.primary,
            left: 0,
            top: 0,
            zIndex: 2,
            opacity: 0.6,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 2,
            height: 60,
            backgroundColor: theme.colors.secondary,
            right: 12,
            top: 12,
            transform: [{ rotate: "-12deg" }],
            zIndex: 2,
            opacity: 0.4,
          }}
        />

        {/* Header Image */}
        {game.venueImage && (
          <View style={{ position: "relative", height: 140 }}>
            <Image
              source={{ uri: game.venueImage }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />

            {/* Almost full indicator */}
            {isAlmostFull && (
              <View
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: theme.colors.warning,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: 4,
                  borderRadius: theme.radius.sm,
                  flexDirection: "row",
                  alignItems: "center",
                  ...theme.shadows.glowStrong,
                }}
              >
                <Zap size={12} color={theme.colors.textBlack} fill={theme.colors.textBlack} strokeWidth={0} />
                <Text
                  style={[
                    theme.typography.captionSmall,
                    {
                      fontFamily: "Oswald_700Bold",
                      color: theme.colors.textBlack,
                      marginLeft: 4,
                    },
                  ]}
                >
                  {spotsLeft} LEFT!
                </Text>
              </View>
            )}

            {/* Dark gradient overlay */}
            <LinearGradient
              colors={["transparent", theme.colors.gradientMid, theme.colors.gradientDark]}
              locations={[0, 0.5, 1]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "70%",
                justifyContent: "flex-end",
                padding: theme.spacing.md,
              }}
            >
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Oswald_700Bold",
                    color: theme.colors.text,
                  },
                ]}
              >
                {game.venue?.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Content */}
        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
          }}
        >
          {!game.venueImage && (
            <Text
              style={[
                theme.typography.h3,
                {
                  fontFamily: "Oswald_700Bold",
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            >
              {game.venue?.toUpperCase()}
            </Text>
          )}

          {/* Game Info Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.md,
            }}
          >
            {/* Date & Time */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock
                size={14}
                color={theme.colors.textSecondary}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Barlow_500Medium",
                    color: theme.colors.textSecondary,
                    marginLeft: theme.spacing.xs,
                  },
                ]}
              >
                {formatDate(game.dateTime)} • {formatTime(game.dateTime)}
              </Text>
            </View>

            {/* Level Badge */}
            <View
              style={{
                backgroundColor: getLevelColor(game.level),
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 4,
                borderRadius: theme.radius.sm,
              }}
            >
              <Text
                style={[
                  theme.typography.captionSmall,
                  {
                    fontFamily: "Oswald_700Bold",
                    color: theme.colors.textBlack,
                  },
                ]}
              >
                {game.level?.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Bottom Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Players Count */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Users size={18} color={theme.colors.primary} strokeWidth={2.5} />
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Barlow_600SemiBold",
                    color: theme.colors.text,
                    marginLeft: theme.spacing.xs,
                  },
                ]}
              >
                {game.playersJoined}/{game.maxPlayers}
              </Text>
            </View>

            {/* Fee */}
            <Text
              style={[
                theme.typography.h4,
                {
                  fontFamily: "Oswald_700Bold",
                  color: theme.colors.primary,
                },
              ]}
            >
              ₱{game.fee}
            </Text>
          </View>

          {/* Progress Bar - VOLT STYLE */}
          <View
            style={{
              marginTop: theme.spacing.md,
              height: 6,
              backgroundColor: theme.colors.cardElevated,
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${(game.playersJoined / game.maxPlayers) * 100}%`,
                backgroundColor: theme.colors.primary,
                borderRadius: 3,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 4,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
