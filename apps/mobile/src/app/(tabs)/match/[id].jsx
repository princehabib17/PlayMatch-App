import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Star,
  Crown,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/utils/theme";
import GoldButton from "@/components/GoldButton";

export default function MatchDetailsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const queryClient = useQueryClient();

  // Mock user ID - in real app this would come from auth
  const currentUserId = 1;

  // Fetch game details
  const {
    data: gameData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const response = await fetch(`/api/games/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch game details");
      }
      const data = await response.json();
      return data;
    },
  });

  // Join game mutation
  const joinGameMutation = useMutation({
    mutationFn: async ({ team }) => {
      const response = await fetch(`/api/games/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          team: team,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join game");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", id] });
      Alert.alert(
        "Success!",
        "You have successfully joined the game. Proceed to payment to secure your spot.",
        [{ text: "OK", onPress: () => router.push("/payment") }],
      );
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const game = gameData?.game;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            theme.typography.body,
            {
              fontFamily: "Inter_500Medium",
              color: theme.colors.textSecondary,
            },
          ]}
        >
          Loading game details...
        </Text>
      </View>
    );
  }

  if (error || !game) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            theme.typography.body,
            {
              fontFamily: "Inter_500Medium",
              color: theme.colors.error,
              textAlign: "center",
              marginBottom: theme.spacing.lg,
            },
          ]}
        >
          Failed to load game details
        </Text>
        <GoldButton title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
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

  const isUserInGame = () => {
    const allPlayers = [
      ...game.teams.A,
      ...game.teams.B,
      ...game.teams.unassigned,
    ];
    return allPlayers.some((player) => player.id === currentUserId);
  };

  const handleJoinTeam = (team) => {
    if (selectedTeam === team) {
      // Join the selected team
      joinGameMutation.mutate({ team });
    } else {
      setSelectedTeam(team);
    }
  };

  const handleJoinGame = () => {
    if (selectedTeam) {
      joinGameMutation.mutate({ team: selectedTeam });
    } else {
      Alert.alert("Select Team", "Please select a team to join first.");
    }
  };

  const renderPlayerSlot = (player, index, team) => {
    const isEmpty = !player;
    const isSelected = selectedTeam === team && isEmpty;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => !player && handleJoinTeam(team)}
        disabled={!!player || isUserInGame()}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: isEmpty
            ? isSelected
              ? theme.colors.primary
              : theme.colors.elevated
            : "transparent",
          borderWidth: isEmpty ? (isSelected ? 3 : 1) : 2,
          borderColor: isEmpty
            ? theme.colors.primary
            : player?.paymentStatus === "paid"
              ? theme.colors.primary
              : theme.colors.textMuted,
          alignItems: "center",
          justifyContent: "center",
          margin: 4,
          opacity: isEmpty && isUserInGame() ? 0.5 : 1,
        }}
      >
        {player ? (
          <>
            <Image
              source={{
                uri:
                  player.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
              }}
              style={{ width: 56, height: 56, borderRadius: 28 }}
            />
            {player.paymentStatus === "paid" && (
              <View
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: theme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Crown
                  size={10}
                  color={theme.colors.background}
                  strokeWidth={2}
                />
              </View>
            )}
          </>
        ) : (
          <Users
            size={24}
            color={isSelected ? theme.colors.background : theme.colors.primary}
            strokeWidth={2}
          />
        )}
      </TouchableOpacity>
    );
  };

  const { date, time } = formatDateTime(game.dateTime);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />

      {/* Header with background image */}
      <View style={{ position: "relative", height: 280 }}>
        <Image
          source={{
            uri:
              game.venue.image ||
              "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
          }}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.8)"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: insets.top + 16,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>

        {/* Match title overlay */}
        <View
          style={{
            position: "absolute",
            bottom: 24,
            left: 16,
            right: 16,
          }}
        >
          <Text
            style={[
              theme.typography.h1,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.text,
                marginBottom: 8,
                letterSpacing: theme.typography.h1.letterSpacing,
              },
            ]}
          >
            {game.title || game.venue.name}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MapPin
              size={16}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                  marginLeft: 8,
                },
              ]}
            >
              {game.venue.location}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120, // Account for sticky button
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Info Cards */}
        <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
          {/* Date & Time Card */}
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Calendar
                    size={20}
                    color={theme.colors.primary}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      theme.typography.body,
                      {
                        fontFamily: "Inter_600SemiBold",
                        color: theme.colors.text,
                        marginLeft: 8,
                      },
                    ]}
                  >
                    {date}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Clock
                    size={20}
                    color={theme.colors.primary}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      theme.typography.body,
                      {
                        fontFamily: "Inter_600SemiBold",
                        color: theme.colors.text,
                        marginLeft: 8,
                      },
                    ]}
                  >
                    {time}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    backgroundColor: getLevelColor(game.level),
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={[
                      theme.typography.caption,
                      {
                        fontFamily: "Inter_700Bold",
                        color: theme.colors.background,
                      },
                    ]}
                  >
                    {game.level}
                  </Text>
                </View>

                <Text
                  style={[
                    theme.typography.h3,
                    {
                      fontFamily: "Figtree_700Bold",
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  ₱{game.fee}
                </Text>
              </View>
            </View>
          </View>

          {/* Teams Section */}
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text
              style={[
                theme.typography.h3,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.text,
                  marginBottom: theme.spacing.lg,
                  textAlign: "center",
                },
              ]}
            >
              Teams ({game.playersJoined}/{game.maxPlayers})
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {/* Team A */}
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={[
                    theme.typography.body,
                    {
                      fontFamily: "Inter_700Bold",
                      color: theme.colors.text,
                      marginBottom: theme.spacing.md,
                    },
                  ]}
                >
                  Team A ({game.teams.A.length})
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: 140,
                  }}
                >
                  {Array.from(
                    { length: Math.ceil(game.maxPlayers / 2) },
                    (_, index) =>
                      renderPlayerSlot(game.teams.A[index], index, "A"),
                  )}
                </View>
              </View>

              {/* VS */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: theme.spacing.md,
                }}
              >
                <Text
                  style={[
                    theme.typography.h2,
                    {
                      fontFamily: "Figtree_700Bold",
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  VS
                </Text>
              </View>

              {/* Team B */}
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={[
                    theme.typography.body,
                    {
                      fontFamily: "Inter_700Bold",
                      color: theme.colors.text,
                      marginBottom: theme.spacing.md,
                    },
                  ]}
                >
                  Team B ({game.teams.B.length})
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: 140,
                  }}
                >
                  {Array.from(
                    { length: Math.ceil(game.maxPlayers / 2) },
                    (_, index) =>
                      renderPlayerSlot(game.teams.B[index], index, "B"),
                  )}
                </View>
              </View>
            </View>

            {selectedTeam && (
              <View
                style={{
                  marginTop: theme.spacing.lg,
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.glow,
                  borderRadius: theme.radius.sm,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    theme.typography.body,
                    {
                      fontFamily: "Inter_500Medium",
                      color: theme.colors.text,
                      textAlign: "center",
                    },
                  ]}
                >
                  Selected Team {selectedTeam}. Tap "Secure Spot" to join!
                </Text>
              </View>
            )}
          </View>

          {/* Game Description */}
          {game.description && (
            <View
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    marginBottom: theme.spacing.sm,
                  },
                ]}
              >
                About This Game
              </Text>

              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                    lineHeight: theme.typography.body.lineHeight,
                  },
                ]}
              >
                {game.description}
              </Text>
            </View>
          )}

          {/* Organizer Info */}
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text
              style={[
                theme.typography.h3,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.text,
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              Organizer
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri:
                    game.organizer.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: theme.spacing.md,
                }}
              />
              <View>
                <Text
                  style={[
                    theme.typography.body,
                    {
                      fontFamily: "Inter_600SemiBold",
                      color: theme.colors.text,
                    },
                  ]}
                >
                  {game.organizer.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
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
                        fontFamily: "Inter_500Medium",
                        color: theme.colors.textSecondary,
                        marginLeft: 4,
                      },
                    ]}
                  >
                    4.8 Rating • 120 Games Organized
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom + theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        {isUserInGame() ? (
          <GoldButton title="Already Joined" disabled={true} />
        ) : game.playersJoined >= game.maxPlayers ? (
          <GoldButton title="Game Full" disabled={true} />
        ) : (
          <GoldButton
            title={selectedTeam ? "Secure Spot" : "Select Team to Join"}
            onPress={selectedTeam ? handleJoinGame : undefined}
            disabled={!selectedTeam || joinGameMutation.isLoading}
          />
        )}
      </View>
    </View>
  );
}
