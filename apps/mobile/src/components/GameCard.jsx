import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Clock, Users, Trophy } from "lucide-react-native";
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
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 6,
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
              size={16}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                  marginLeft: theme.spacing.xs,
                  letterSpacing: theme.typography.caption.letterSpacing,
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
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.radius.sm,
            }}
          >
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_700Bold",
                  color: theme.colors.background,
                  letterSpacing: theme.typography.caption.letterSpacing,
                },
              ]}
            >
              {game.level}
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
            <Users size={16} color={theme.colors.primary} strokeWidth={2} />
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_500Medium",
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
              theme.typography.body,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.primary,
              },
            ]}
          >
            ₱{game.fee}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            marginTop: theme.spacing.md,
            height: 4,
            backgroundColor: theme.colors.elevated,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${(game.playersJoined / game.maxPlayers) * 100}%`,
              backgroundColor: theme.colors.primary,
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
