import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserPlus, MessageCircle, Users, Star } from "lucide-react-native";
import { useTheme } from "@/utils/theme";
import GoldButton from "@/components/GoldButton";

// Mock friends data
const mockFriends = [
  {
    id: 1,
    name: "Carlos Martinez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    location: "Makati City",
    rating: 4.8,
    gamesPlayed: 150,
    status: "online",
    lastGame: "2 hours ago",
  },
  {
    id: 2,
    name: "Rico Dela Cruz",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    location: "Quezon City",
    rating: 4.5,
    gamesPlayed: 89,
    status: "offline",
    lastGame: "1 day ago",
  },
  {
    id: 3,
    name: "Jake Ramirez",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150",
    location: "Pasig City",
    rating: 4.1,
    gamesPlayed: 32,
    status: "online",
    lastGame: "30 minutes ago",
  },
  {
    id: 4,
    name: "Paolo Mendoza",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    location: "Manila Bay",
    rating: 4.6,
    gamesPlayed: 67,
    status: "in-game",
    lastGame: "Playing now",
  },
];

export default function FriendsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return theme.colors.success;
      case "in-game":
        return theme.colors.primary;
      case "offline":
        return theme.colors.textMuted;
      default:
        return theme.colors.textMuted;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "Online";
      case "in-game":
        return "In Game";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: insets.bottom + 100, // Account for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                theme.typography.h1,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.text,
                  letterSpacing: theme.typography.h1.letterSpacing,
                },
              ]}
            >
              Friends
            </Text>
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.xs,
                },
              ]}
            >
              {mockFriends.length} friends
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserPlus
              size={22}
              color={theme.colors.background}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    theme.typography.h2,
                    {
                      fontFamily: "Figtree_700Bold",
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  {
                    mockFriends.filter(
                      (f) => f.status === "online" || f.status === "in-game",
                    ).length
                  }
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      fontFamily: "Inter_500Medium",
                      color: theme.colors.textSecondary,
                      letterSpacing: theme.typography.caption.letterSpacing,
                    },
                  ]}
                >
                  Online
                </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    theme.typography.h2,
                    {
                      fontFamily: "Figtree_700Bold",
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  {mockFriends.filter((f) => f.status === "in-game").length}
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      fontFamily: "Inter_500Medium",
                      color: theme.colors.textSecondary,
                      letterSpacing: theme.typography.caption.letterSpacing,
                    },
                  ]}
                >
                  Playing
                </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    theme.typography.h2,
                    {
                      fontFamily: "Figtree_700Bold",
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  {Math.round(
                    (mockFriends.reduce((acc, f) => acc + f.rating, 0) /
                      mockFriends.length) *
                      10,
                  ) / 10}
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      fontFamily: "Inter_500Medium",
                      color: theme.colors.textSecondary,
                      letterSpacing: theme.typography.caption.letterSpacing,
                    },
                  ]}
                >
                  Avg Rating
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Friends List */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <Text
            style={[
              theme.typography.h3,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                letterSpacing: theme.typography.h3.letterSpacing,
              },
            ]}
          >
            All Friends
          </Text>

          {mockFriends.map((friend) => (
            <View
              key={friend.id}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Avatar with status indicator */}
                <View
                  style={{
                    position: "relative",
                    marginRight: theme.spacing.md,
                  }}
                >
                  <Image
                    source={{ uri: friend.avatar }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      borderWidth: 2,
                      borderColor: theme.colors.border,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: getStatusColor(friend.status),
                      borderWidth: 2,
                      borderColor: theme.colors.background,
                    }}
                  />
                </View>

                {/* Friend Info */}
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
                    {friend.name}
                  </Text>

                  <Text
                    style={[
                      theme.typography.body,
                      {
                        fontFamily: "Inter_500Medium",
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.xs,
                      },
                    ]}
                  >
                    {friend.location}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.md,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Star
                        size={14}
                        color={theme.colors.primary}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          theme.typography.caption,
                          {
                            fontFamily: "Inter_600SemiBold",
                            color: theme.colors.primary,
                            marginLeft: theme.spacing.xs,
                            letterSpacing:
                              theme.typography.caption.letterSpacing,
                          },
                        ]}
                      >
                        {friend.rating}
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Users
                        size={14}
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
                            letterSpacing:
                              theme.typography.caption.letterSpacing,
                          },
                        ]}
                      >
                        {friend.gamesPlayed} games
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      theme.typography.caption,
                      {
                        fontFamily: "Inter_600SemiBold",
                        color: getStatusColor(friend.status),
                        marginBottom: theme.spacing.sm,
                        letterSpacing: theme.typography.caption.letterSpacing,
                      },
                    ]}
                  >
                    {getStatusText(friend.status)}
                  </Text>

                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MessageCircle
                      size={20}
                      color={theme.colors.background}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Last activity */}
              <View
                style={{
                  marginTop: theme.spacing.md,
                  paddingTop: theme.spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.border,
                }}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      fontFamily: "Inter_500Medium",
                      color: theme.colors.textMuted,
                      letterSpacing: theme.typography.caption.letterSpacing,
                    },
                  ]}
                >
                  Last game: {friend.lastGame}
                </Text>
              </View>
            </View>
          ))}

          {/* Find Friends CTA */}
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.lg,
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Users size={48} color={theme.colors.primary} strokeWidth={1.5} />
            <Text
              style={[
                theme.typography.h3,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.text,
                  textAlign: "center",
                  marginTop: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                  letterSpacing: theme.typography.h3.letterSpacing,
                },
              ]}
            >
              Find More Friends
            </Text>
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  marginBottom: theme.spacing.lg,
                },
              ]}
            >
              Connect with players from your games and grow your football
              network
            </Text>
            <GoldButton title="Find Friends" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
