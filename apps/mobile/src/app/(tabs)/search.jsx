import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search as SearchIcon, Filter, MapPin, Map } from "lucide-react-native";
import { useTheme } from "@/utils/theme";
import { useQuery } from "@tanstack/react-query";
import GameCard from "@/components/GameCard";
import { router } from "expo-router";

export default function SearchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    skillLevel: "",
    maxFee: null,
    dateRange: "all",
  });

  // Fetch games with search and filters
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["games", "search", searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filters.skillLevel) params.append("skillLevel", filters.skillLevel);
      if (filters.maxFee) params.append("maxFee", filters.maxFee);
      params.append("limit", "20");

      const response = await fetch(`/api/games?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to search games");
      }
      const data = await response.json();
      return data;
    },
    enabled: true, // Always run the query
  });

  const handleGamePress = (game) => {
    router.push(`/match/${game.id}`);
  };

  const games = searchResults?.games || [];

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
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <Text
            style={[
              theme.typography.h1,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                letterSpacing: theme.typography.h1.letterSpacing,
              },
            ]}
          >
            Search Games
          </Text>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderWidth: 1,
              borderColor: theme.colors.border,
              marginBottom: theme.spacing.lg,
            }}
          >
            <SearchIcon
              size={20}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by venue or organizer"
              placeholderTextColor={theme.colors.textSecondary}
              style={[
                theme.typography.body,
                {
                  flex: 1,
                  marginLeft: theme.spacing.md,
                  color: theme.colors.text,
                  fontFamily: "Inter_500Medium",
                },
              ]}
            />
          </View>

          {/* Quick Filters */}
          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.lg,
            }}
          >
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() =>
                  setFilters({
                    ...filters,
                    skillLevel: filters.skillLevel === level ? "" : level,
                  })
                }
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radius.round,
                  backgroundColor:
                    filters.skillLevel === level
                      ? theme.colors.primary
                      : theme.colors.card,
                  borderWidth: 1,
                  borderColor:
                    filters.skillLevel === level
                      ? theme.colors.primary
                      : theme.colors.border,
                }}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      fontFamily: "Inter_600SemiBold",
                      color:
                        filters.skillLevel === level
                          ? theme.colors.background
                          : theme.colors.textSecondary,
                      letterSpacing: theme.typography.caption.letterSpacing,
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* View Toggle */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
              Results ({games.length})
            </Text>

            <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
              <TouchableOpacity
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radius.sm,
                  backgroundColor: theme.colors.card,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Map
                  size={20}
                  color={theme.colors.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.radius.sm,
                  backgroundColor: theme.colors.card,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Filter
                  size={20}
                  color={theme.colors.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          {isLoading && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.xl,
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
                Searching games...
              </Text>
            </View>
          )}

          {error && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.xl,
              }}
            >
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.error,
                    textAlign: "center",
                  },
                ]}
              >
                Failed to search games. Please try again.
              </Text>
            </View>
          )}

          {!isLoading && !error && games.length === 0 && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.xl,
              }}
            >
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    marginBottom: theme.spacing.md,
                  },
                ]}
              >
                No games found
              </Text>
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Inter_500Medium",
                    color: theme.colors.textMuted,
                    textAlign: "center",
                  },
                ]}
              >
                Try adjusting your search or filters
              </Text>
            </View>
          )}

          {games.map((game) => (
            <GameCard key={game.id} game={game} onPress={handleGamePress} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
