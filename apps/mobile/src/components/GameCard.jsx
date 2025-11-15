import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme";

export default function GameCard({
  game,
  onPress,
  variant = "default",
  style,
}) {
  const theme = useTheme();

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
        return "#FFB800";
      case "Advanced":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(game)}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          marginBottom: theme.components.cardMargin,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Header Image */}
      {game.venueImage && (
        <View style={{ position: "relative", height: 160 }}>
          <Image
            source={{ uri: game.venueImage }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: theme.components.cardPadding,
              right: theme.components.cardPadding,
              height: 72,
              justifyContent: "flex-end",
              paddingVertical: theme.spacing.md,
            }}
          >
            <Text
              style={[
                theme.typography.h3,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.text,
                  letterSpacing: theme.typography.h3.letterSpacing,
                },
              ]}
            >
              {game.venue}
            </Text>
          </LinearGradient>
        </View>
      )}

      {/* Content */}
      <View
        style={{
          paddingHorizontal: theme.components.cardPadding,
          paddingVertical: theme.spacing.lg,
        }}
      >
        {!game.venueImage && (
          <Text
            style={[
              theme.typography.h3,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.text,
                marginBottom: theme.spacing.sm,
                letterSpacing: theme.typography.h3.letterSpacing,
              },
            ]}
          >
            {game.venue}
          </Text>
        )}

        {/* Date & Time - NO ICON */}
        <View style={{ marginBottom: theme.spacing.sm }}>
          <Text
            style={[
              theme.typography.bodySmall,
              {
                fontFamily: "Inter_500Medium",
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {formatDate(game.dateTime)} • {formatTime(game.dateTime)}
          </Text>
        </View>

        {/* Game Info Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          {/* Players Count - NO ICON, cleaner text */}
          <Text
            style={[
              theme.typography.body,
              {
                fontFamily: "Inter_600SemiBold",
                color: theme.colors.text,
              },
            ]}
          >
            {game.playersJoined}/{game.maxPlayers} players
          </Text>

          {/* Level Badge - smaller, subtler */}
          <View
            style={{
              backgroundColor: `${getLevelColor(game.level)}15`,
              borderWidth: 1,
              borderColor: getLevelColor(game.level),
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 4,
              borderRadius: theme.radius.xs,
            }}
          >
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_600SemiBold",
                  color: getLevelColor(game.level),
                  fontSize: 11,
                },
              ]}
            >
              {game.level.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Fee - more prominent */}
        <Text
          style={[
            theme.typography.h3,
            {
              fontFamily: "Figtree_700Bold",
              color: theme.colors.primary,
              marginBottom: theme.spacing.sm,
            },
          ]}
        >
          ₱{game.fee}
        </Text>

        {/* Progress Bar - thinner, subtler */}
        <View
          style={{
            marginTop: theme.spacing.xs,
            height: 3,
            backgroundColor: theme.colors.elevated,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${(game.playersJoined / game.maxPlayers) * 100}%`,
              backgroundColor:
                game.playersJoined / game.maxPlayers > 0.8
                  ? theme.colors.success
                  : theme.colors.textMuted,
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
