import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Filter, MapPin, Clock, Users, Star } from "lucide-react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/utils/theme";
import GameCard from "@/components/GameCard";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth * 0.85;

// Sample games data - always show something
const sampleGames = [
  {
    id: "sample-1",
    venue: "Ultra Sports Complex",
    venueImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    dateTime: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    level: "Intermediate",
    playersJoined: 8,
    maxPlayers: 14,
    fee: 350,
  },
  {
    id: "sample-2",
    venue: "Makati Football Pitch",
    venueImage: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800",
    dateTime: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days
    level: "Advanced",
    playersJoined: 12,
    maxPlayers: 14,
    fee: 450,
  },
  {
    id: "sample-3",
    venue: "BGC Green Field",
    venueImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    dateTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
    level: "Beginner",
    playersJoined: 5,
    maxPlayers: 12,
    fee: 250,
  },
  {
    id: "sample-4",
    venue: "Quezon City Dome",
    venueImage: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
    dateTime: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow evening
    level: "Intermediate",
    playersJoined: 10,
    maxPlayers: 16,
    fee: 300,
  },
  {
    id: "sample-5",
    venue: "Alabang Soccer Field",
    venueImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    dateTime: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days
    level: "Advanced",
    playersJoined: 13,
    maxPlayers: 14,
    fee: 500,
  },
];

// Mock data for featured content (tournaments, highlights, etc.)
const featuredData = [
  {
    id: "tournament-1",
    type: "tournament",
    title: "Weekend Warriors Cup",
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800",
    description: "Join the biggest amateur tournament in Metro Manila",
    prize: "₱50,000",
  },
  {
    id: "highlight-1",
    type: "highlight",
    title: "Best Goals This Week",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    views: "12.5K",
    duration: "2:45",
  },
  {
    id: "totw-1",
    type: "totw",
    title: "Team of the Week",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    description: "Outstanding performers from last week",
  },
];

function FeaturedCard({ item, index, scrollX }) {
  const theme = useTheme();

  const inputRange = [
    (index - 1) * cardWidth,
    index * cardWidth,
    (index + 1) * cardWidth,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: "clamp",
  });

  const renderCardContent = () => {
    switch (item.type) {
      case "featured_game":
        return (
          <View style={{ padding: theme.spacing.md }}>
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
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: theme.spacing.xs,
              }}
            >
              <MapPin
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
                  },
                ]}
              >
                {item.venue}
              </Text>
            </View>
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_700Bold",
                  color: theme.colors.primary,
                },
              ]}
            >
              ₱{item.fee} • {item.level}
            </Text>
          </View>
        );

      case "tournament":
        return (
          <View style={{ padding: theme.spacing.md }}>
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
              {item.title}
            </Text>
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            >
              {item.description}
            </Text>
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_700Bold",
                  color: theme.colors.primary,
                },
              ]}
            >
              Prize Pool: {item.prize}
            </Text>
          </View>
        );

      default:
        return (
          <View style={{ padding: theme.spacing.md }}>
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
              {item.title}
            </Text>
            {item.description && (
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
                {item.description}
              </Text>
            )}
          </View>
        );
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity,
        width: cardWidth,
        marginRight: theme.spacing.md,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (item.type === "featured_game") {
            router.push(`/match/${item.id}`);
          }
        }}
        activeOpacity={0.9}
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: theme.colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <View style={{ position: "relative", height: 160 }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            {renderCardContent()}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Fetch nearby games
  const {
    data: gamesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["games", "nearby"],
    queryFn: async () => {
      const response = await fetch("/api/games?limit=10&status=open");
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await response.json();
      return data;
    },
  });

  // Fetch featured game for carousel
  const { data: featuredGameData } = useQuery({
    queryKey: ["games", "featured"],
    queryFn: async () => {
      const response = await fetch(
        "/api/games?limit=1&status=open&skillLevel=Advanced",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch featured game");
      }
      const data = await response.json();
      return data;
    },
  });

  const handleGamePress = (game) => {
    router.push(`/match/${game.id}`);
  };

  // Combine featured game with other featured content
  const allFeaturedData = [
    // Add featured game at the beginning if available
    ...(featuredGameData?.games && featuredGameData.games.length > 0
      ? [
          {
            ...featuredGameData.games[0],
            type: "featured_game",
            image:
              featuredGameData.games[0].venueImage ||
              "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
          },
        ]
      : []),
    ...featuredData,
  ];

  // Use sample games if no real data available
  const nearbyGames = gamesData?.games?.length > 0 ? gamesData.games : sampleGames;

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
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
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
              PlayMatch
            </Text>

            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.colors.card,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Bell size={22} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Social proof subtitle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.colors.success,
              }}
            />
            <Text
              style={[
                theme.typography.bodySmall,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              127 players joined games this week
            </Text>
          </View>
        </View>

        {/* Featured Carousel */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={[
              theme.typography.h2,
              {
                fontFamily: "Figtree_700Bold",
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                paddingHorizontal: theme.spacing.md,
                letterSpacing: theme.typography.h2.letterSpacing,
              },
            ]}
          >
            Featured
          </Text>

          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: theme.spacing.md,
              paddingRight: theme.spacing.md - cardWidth * 0.1,
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true },
            )}
            snapToInterval={cardWidth + theme.spacing.md}
            decelerationRate="fast"
          >
            {allFeaturedData.map((item, index) => (
              <FeaturedCard
                key={item.id}
                item={item}
                index={index}
                scrollX={scrollX}
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/* Nearby Games */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <View style={{ marginBottom: theme.spacing.lg }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.xs,
              }}
            >
              <Text
                style={[
                  theme.typography.h2,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.text,
                    letterSpacing: theme.typography.h2.letterSpacing,
                  },
                ]}
              >
                Games Near You
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/(tabs)/search")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Filter
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
                  Filter
                </Text>
              </TouchableOpacity>
            </View>

            {/* Section description */}
            <Text
              style={[
                theme.typography.bodySmall,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textMuted,
                },
              ]}
            >
              Popular matches in Metro Manila
            </Text>
          </View>

          {/* Loading state */}
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
                Loading games...
              </Text>
            </View>
          )}

          {/* Error state */}
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
                Failed to load games. Pull down to refresh.
              </Text>
            </View>
          )}

          {/* Games list */}
          {nearbyGames.map((game) => (
            <GameCard key={game.id} game={game} onPress={handleGamePress} />
          ))}

          {/* Empty state */}
          {!isLoading && !error && nearbyGames.length === 0 && (
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
                  },
                ]}
              >
                No games nearby. Check back later or create your own!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
