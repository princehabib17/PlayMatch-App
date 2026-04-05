import React, { useRef, useState, useEffect } from "react";
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
import { Bell, Filter, MapPin, Clock, Users, Star, Zap, TrendingUp } from "lucide-react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/utils/theme";
import GameCard from "@/components/GameCard";

import { apiFetch } from "@/utils/api";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const cardWidth = screenWidth * 0.88;

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

// Diagonal slash accent component
function DiagonalSlash({ color, width = 4, style }) {
  return (
    <View
      style={[
        {
          position: "absolute",
          width: width,
          height: "120%",
          backgroundColor: color,
          transform: [{ rotate: "-12deg" }, { translateY: -10 }],
        },
        style,
      ]}
    />
  );
}

function FeaturedCard({ item, index, scrollX }) {
  const theme = useTheme();
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const inputRange = [
    (index - 1) * (cardWidth + theme.spacing.md),
    index * (cardWidth + theme.spacing.md),
    (index + 1) * (cardWidth + theme.spacing.md),
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.92, 1, 0.92],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
    extrapolate: "clamp",
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderCardContent = () => {
    switch (item.type) {
      case "featured_game":
        return (
          <View style={{ padding: theme.spacing.lg }}>
            {/* Diagonal accent */}
            <DiagonalSlash color={theme.colors.primary} width={3} style={{ left: -20, opacity: 0.6 }} />
            <DiagonalSlash color={theme.colors.secondary} width={2} style={{ left: 10, opacity: 0.4 }} />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.xs }}>
              <Zap size={18} color={theme.colors.primary} fill={theme.colors.primary} strokeWidth={0} />
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Oswald_600SemiBold",
                    color: theme.colors.primary,
                    marginLeft: theme.spacing.xs,
                  },
                ]}
              >
                FEATURED
              </Text>
            </View>

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
              {item.title?.toUpperCase()}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: theme.spacing.sm,
              }}
            >
              <MapPin
                size={14}
                color={theme.colors.textSecondary}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  theme.typography.bodySmall,
                  {
                    fontFamily: "Barlow_500Medium",
                    color: theme.colors.textSecondary,
                    marginLeft: theme.spacing.xs,
                  },
                ]}
              >
                {item.venue}
              </Text>
            </View>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.md,
            }}>
              <Text
                style={[
                  theme.typography.h4,
                  {
                    fontFamily: "Oswald_700Bold",
                    color: theme.colors.primary,
                  },
                ]}
              >
                ₱{item.fee}
              </Text>
              <View style={{
                backgroundColor: theme.colors.glowPrimary,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 4,
                borderRadius: theme.radius.sm,
              }}>
                <Text
                  style={[
                    theme.typography.captionSmall,
                    {
                      fontFamily: "Oswald_600SemiBold",
                      color: theme.colors.text,
                    },
                  ]}
                >
                  {item.level?.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        );

      case "tournament":
        return (
          <View style={{ padding: theme.spacing.lg }}>
            <DiagonalSlash color={theme.colors.warning} width={3} style={{ right: -20, opacity: 0.5 }} />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.xs }}>
              <TrendingUp size={18} color={theme.colors.warning} strokeWidth={2.5} />
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Oswald_600SemiBold",
                    color: theme.colors.warning,
                    marginLeft: theme.spacing.xs,
                  },
                ]}
              >
                TOURNAMENT
              </Text>
            </View>

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
              {item.title?.toUpperCase()}
            </Text>

            <Text
              style={[
                theme.typography.bodySmall,
                {
                  fontFamily: "Barlow_400Regular",
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              {item.description}
            </Text>

            <Text
              style={[
                theme.typography.h4,
                {
                  fontFamily: "Oswald_700Bold",
                  color: theme.colors.warning,
                },
              ]}
            >
              PRIZE: {item.prize}
            </Text>
          </View>
        );

      default:
        return (
          <View style={{ padding: theme.spacing.lg }}>
            <Text
              style={[
                theme.typography.h3,
                {
                  fontFamily: "Oswald_700Bold",
                  color: theme.colors.text,
                },
              ]}
            >
              {item.title?.toUpperCase()}
            </Text>
            {item.description && (
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Barlow_400Regular",
                    color: theme.colors.textSecondary,
                    marginTop: theme.spacing.sm,
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
        activeOpacity={0.85}
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          overflow: "hidden",
          borderWidth: 2,
          borderColor: theme.colors.border,
          ...theme.shadows.glow,
        }}
      >
        <View style={{ position: "relative", height: 220 }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />

          {/* Animated glow overlay */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.colors.primary,
              opacity: glowOpacity,
            }}
          />

          {/* Dark gradient overlay */}
          <LinearGradient
            colors={["transparent", theme.colors.gradientMid, theme.colors.gradientDark]}
            locations={[0, 0.4, 1]}
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
      const response = await apiFetch("/api/games?limit=10&status=open");
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
      const response = await apiFetch(
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

  const nearbyGames = gamesData?.games || [];

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
        {/* Header - BOLD ATHLETIC */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
            position: "relative",
          }}
        >
          {/* Background diagonal slashes */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, overflow: "hidden" }}>
            <DiagonalSlash color={theme.colors.glowPrimary} width={80} style={{ left: -40, opacity: 0.08 }} />
            <DiagonalSlash color={theme.colors.glowSecondary} width={60} style={{ right: 40, opacity: 0.06 }} />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.display,
                  {
                    fontFamily: "Oswald_700Bold",
                    color: theme.colors.text,
                    textShadowColor: theme.colors.glowPrimary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 20,
                  },
                ]}
              >
                PLAYMATCH
              </Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: theme.spacing.xs,
              }}>
                <View style={{
                  width: 3,
                  height: 16,
                  backgroundColor: theme.colors.primary,
                  marginRight: theme.spacing.sm,
                }} />
                <Text
                  style={[
                    theme.typography.body,
                    {
                      fontFamily: "Barlow_500Medium",
                      color: theme.colors.textSecondary,
                      letterSpacing: 0.5,
                    },
                  ]}
                >
                  Your Next Game Awaits
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: 52,
                height: 52,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.cardElevated,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: theme.colors.border,
                ...theme.shadows.glow,
              }}
            >
              <Bell size={24} color={theme.colors.primary} strokeWidth={2.5} />
              {/* Notification dot */}
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.colors.error,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Carousel */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.md,
          }}>
            <View style={{
              width: 4,
              height: 24,
              backgroundColor: theme.colors.primary,
              marginRight: theme.spacing.sm,
              transform: [{ skewX: '-12deg' }],
            }} />
            <Text
              style={[
                theme.typography.h2,
                {
                  fontFamily: "Oswald_700Bold",
                  color: theme.colors.text,
                },
              ]}
            >
              FEATURED
            </Text>
            <Zap
              size={20}
              color={theme.colors.primary}
              fill={theme.colors.primary}
              strokeWidth={0}
              style={{ marginLeft: theme.spacing.sm }}
            />
          </View>

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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.lg,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                width: 4,
                height: 24,
                backgroundColor: theme.colors.secondary,
                marginRight: theme.spacing.sm,
                transform: [{ skewX: '-12deg' }],
              }} />
              <Text
                style={[
                  theme.typography.h2,
                  {
                    fontFamily: "Oswald_700Bold",
                    color: theme.colors.text,
                  },
                ]}
              >
                NEARBY GAMES
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/search")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.cardElevated,
                borderWidth: 1.5,
                borderColor: theme.colors.border,
              }}
            >
              <Filter
                size={16}
                color={theme.colors.primary}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Oswald_600SemiBold",
                    color: theme.colors.primary,
                    marginLeft: theme.spacing.xs,
                  },
                ]}
              >
                FILTER
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading state */}
          {isLoading && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.xxxl,
              }}
            >
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Oswald_600SemiBold",
                    color: theme.colors.primary,
                  },
                ]}
              >
                LOADING GAMES...
              </Text>
            </View>
          )}

          {/* Error state */}
          {error && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: theme.spacing.xxxl,
                paddingHorizontal: theme.spacing.xl,
              }}
            >
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Oswald_600SemiBold",
                    color: theme.colors.error,
                    textAlign: "center",
                    marginBottom: theme.spacing.sm,
                  },
                ]}
              >
                LOAD FAILED
              </Text>
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Barlow_400Regular",
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                  },
                ]}
              >
                Pull down to refresh
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
                paddingVertical: theme.spacing.xxxl,
                paddingHorizontal: theme.spacing.xl,
              }}
            >
              <Text
                style={[
                  theme.typography.h3,
                  {
                    fontFamily: "Oswald_600SemiBold",
                    color: theme.colors.textMuted,
                    textAlign: "center",
                    marginBottom: theme.spacing.sm,
                  },
                ]}
              >
                NO GAMES NEARBY
              </Text>
              <Text
                style={[
                  theme.typography.body,
                  {
                    fontFamily: "Barlow_400Regular",
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                  },
                ]}
              >
                Check back later or create your own!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
