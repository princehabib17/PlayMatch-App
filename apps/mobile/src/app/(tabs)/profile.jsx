import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Settings,
  Trophy,
  Star,
  Award,
  Users,
  Calendar,
  TrendingUp,
  Zap,
  Target,
  Shield,
  Gauge,
} from "lucide-react-native";
import { useTheme } from "@/utils/theme";

const { width: screenWidth } = Dimensions.get("window");

// Updated user data to match the images exactly
const mockUser = {
  id: 1,
  name: "Miguel Santos",
  email: "miguel@email.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  location: "BGC Taguig",
  bio: "Midfielder who loves tactical games",
  rating: 4.2,
  gamesPlayed: 45,
  stats: {
    manOfTheMatch: 117, // Match the image exactly
    teamOfTheWeek: 11, // Match the image exactly
    games: 45, // Match the image exactly
    goals: 23,
    assists: 45,
    winRate: 68,
  },
  positions: {
    primary: "CAM",
    secondary: "CDM",
  },
  skills: {
    Speed: 85,
    Shooting: 92, // Higher to match image
    Passing: 88, // Match image levels
    Defending: 74, // Lower to match image
    Dribbling: 90, // Higher to match image
    Grinta: 95, // Fighting spirit - highest
  },
};

// Enhanced Radar chart component to match the design in images
function SkillsRadarChart({ skills }) {
  const theme = useTheme();
  const chartSize = screenWidth - 60;
  const center = chartSize / 2;
  const maxRadius = center - 80;

  const skillKeys = Object.keys(skills);
  const skillValues = Object.values(skills);

  // Calculate points for radar chart
  const getPointForSkill = (value, index) => {
    const angle = (index * 2 * Math.PI) / skillKeys.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Calculate label positions
  const getLabelPosition = (index) => {
    const angle = (index * 2 * Math.PI) / skillKeys.length - Math.PI / 2;
    const labelRadius = maxRadius + 35;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y };
  };

  return (
    <View
      style={{
        height: chartSize + 40,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: theme.colors.primary + "30",
        marginVertical: theme.spacing.md,
      }}
    >
      <View
        style={{
          width: chartSize - 40,
          height: chartSize - 40,
          position: "relative",
        }}
      >
        {/* Background grid circles */}
        {[20, 40, 60, 80, 100].map((percentage, index) => {
          const radius = (percentage / 100) * maxRadius;
          return (
            <View
              key={percentage}
              style={{
                position: "absolute",
                top: center - radius,
                left: center - radius,
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                borderWidth: 1,
                borderColor: theme.colors.border,
                opacity: 0.3,
              }}
            />
          );
        })}

        {/* Center point */}
        <View
          style={{
            position: "absolute",
            top: center - 3,
            left: center - 3,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.colors.primary,
          }}
        />

        {/* Axis lines from center to each skill point */}
        {skillKeys.map((skill, index) => {
          const point = getPointForSkill(100, index); // Line to edge
          return (
            <View
              key={`axis-${skill}`}
              style={{
                position: "absolute",
                top: center,
                left: center,
                width: Math.sqrt(
                  Math.pow(point.x - center, 2) + Math.pow(point.y - center, 2),
                ),
                height: 1,
                backgroundColor: theme.colors.border,
                opacity: 0.3,
                transformOrigin: "0 0",
                transform: [
                  {
                    rotate: `${Math.atan2(point.y - center, point.x - center)}rad`,
                  },
                ],
              }}
            />
          );
        })}

        {/* Skill area polygon overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: chartSize - 40,
            height: chartSize - 40,
            backgroundColor: theme.colors.primary + "15",
            borderRadius: (chartSize - 40) / 2,
          }}
        />

        {/* Skill value dots */}
        {skillKeys.map((skill, index) => {
          const point = getPointForSkill(skills[skill], index);
          return (
            <View
              key={`${skill}-dot`}
              style={{
                position: "absolute",
                left: point.x - 8,
                top: point.y - 8,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: theme.colors.primary,
                borderWidth: 3,
                borderColor: theme.colors.background,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
              }}
            />
          );
        })}

        {/* Skill labels and values */}
        {skillKeys.map((skill, index) => {
          const labelPos = getLabelPosition(index);

          return (
            <View
              key={skill}
              style={{
                position: "absolute",
                left: labelPos.x - 35,
                top: labelPos.y - 20,
                width: 70,
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Inter_700Bold",
                    color: theme.colors.text,
                    textAlign: "center",
                    letterSpacing: theme.typography.caption.letterSpacing,
                    fontSize: 11,
                  },
                ]}
              >
                {skill}
              </Text>
              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontFamily: "Figtree_700Bold",
                    color: theme.colors.primary,
                    textAlign: "center",
                    fontSize: 13,
                    marginTop: 2,
                  },
                ]}
              >
                {skills[skill]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Stats");

  const tabs = ["Stats", "Posts", "Dashboard"];

  const renderStatsContent = () => (
    <View style={{ gap: theme.spacing.lg }}>
      {/* Player Stats Cards - Horizontal layout like in the image */}
      <View>
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
          Player Stats
        </Text>

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          {/* Man of the Match - 117 */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              alignItems: "center",
              borderWidth: 2,
              borderColor: theme.colors.primary + "30",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: theme.spacing.md,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Trophy
                size={28}
                color={theme.colors.background}
                strokeWidth={2.5}
              />
            </View>
            <Text
              style={[
                theme.typography.h1,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.primary,
                  textAlign: "center",
                  fontSize: 28,
                },
              ]}
            >
              {mockUser.stats.manOfTheMatch}
            </Text>
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_600SemiBold",
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  letterSpacing: theme.typography.caption.letterSpacing,
                  marginTop: theme.spacing.xs,
                },
              ]}
            >
              Man of the match
            </Text>
          </View>

          {/* Team of the Week - 11 */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              alignItems: "center",
              borderWidth: 2,
              borderColor: theme.colors.primary + "30",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: theme.spacing.md,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Star
                size={28}
                color={theme.colors.background}
                strokeWidth={2.5}
                fill={theme.colors.background}
              />
            </View>
            <Text
              style={[
                theme.typography.h1,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.primary,
                  textAlign: "center",
                  fontSize: 28,
                },
              ]}
            >
              {mockUser.stats.teamOfTheWeek}
            </Text>
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_600SemiBold",
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  letterSpacing: theme.typography.caption.letterSpacing,
                  marginTop: theme.spacing.xs,
                },
              ]}
            >
              Team of the week
            </Text>
          </View>

          {/* Games - 45 */}
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              alignItems: "center",
              borderWidth: 2,
              borderColor: theme.colors.primary + "30",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: theme.spacing.md,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Users
                size={28}
                color={theme.colors.background}
                strokeWidth={2.5}
              />
            </View>
            <Text
              style={[
                theme.typography.h1,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.primary,
                  textAlign: "center",
                  fontSize: 28,
                },
              ]}
            >
              {mockUser.stats.games}
            </Text>
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_600SemiBold",
                  color: theme.colors.textSecondary,
                  textAlign: "center",
                  letterSpacing: theme.typography.caption.letterSpacing,
                  marginTop: theme.spacing.xs,
                },
              ]}
            >
              Games
            </Text>
          </View>
        </View>
      </View>

      {/* Position - Gold badges like in the image */}
      <View>
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
          Position
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.md,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
              alignItems: "center",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.background,
                  marginBottom: theme.spacing.xs,
                  letterSpacing: theme.typography.caption.letterSpacing,
                  opacity: 0.8,
                },
              ]}
            >
              Primary Position
            </Text>
            <Text
              style={[
                theme.typography.h2,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.background,
                  letterSpacing: theme.typography.h2.letterSpacing,
                },
              ]}
            >
              {mockUser.positions.primary}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.xl,
              paddingVertical: theme.spacing.md,
              alignItems: "center",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              style={[
                theme.typography.caption,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.background,
                  marginBottom: theme.spacing.xs,
                  letterSpacing: theme.typography.caption.letterSpacing,
                  opacity: 0.8,
                },
              ]}
            >
              Secondary Position
            </Text>
            <Text
              style={[
                theme.typography.h2,
                {
                  fontFamily: "Figtree_700Bold",
                  color: theme.colors.background,
                  letterSpacing: theme.typography.h2.letterSpacing,
                },
              ]}
            >
              {mockUser.positions.secondary}
            </Text>
          </View>
        </View>
      </View>

      {/* Skills Radar Chart - Enhanced to match the image */}
      <View>
        <Text
          style={[
            theme.typography.h3,
            {
              fontFamily: "Figtree_700Bold",
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
              letterSpacing: theme.typography.h3.letterSpacing,
            },
          ]}
        >
          Skills
        </Text>

        <SkillsRadarChart skills={mockUser.skills} />
      </View>
    </View>
  );

  const renderPostsContent = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: theme.spacing.xxl,
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
        No posts yet. Share your highlights!
      </Text>
    </View>
  );

  const renderDashboardContent = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: theme.spacing.xxl,
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
        Dashboard coming soon...
      </Text>
    </View>
  );

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
              Profile
            </Text>
          </View>

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
            <Settings size={22} color={theme.colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{ position: "relative", marginRight: theme.spacing.md }}
              >
                <Image
                  source={{ uri: mockUser.avatar }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    borderWidth: 3,
                    borderColor: theme.colors.primary,
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.typography.h2,
                    {
                      fontFamily: "Figtree_700Bold",
                      color: theme.colors.text,
                      marginBottom: theme.spacing.xs,
                      letterSpacing: theme.typography.h2.letterSpacing,
                    },
                  ]}
                >
                  {mockUser.name}
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
                  {mockUser.location}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Star
                    size={16}
                    color={theme.colors.primary}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      theme.typography.body,
                      {
                        fontFamily: "Inter_600SemiBold",
                        color: theme.colors.primary,
                        marginLeft: theme.spacing.xs,
                      },
                    ]}
                  >
                    {mockUser.rating}/5.0
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_500Medium",
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.md,
                  lineHeight: theme.typography.body.lineHeight,
                },
              ]}
            >
              {mockUser.bio}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              padding: theme.spacing.xs,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.md,
                  borderRadius: theme.radius.sm,
                  backgroundColor:
                    activeTab === tab ? theme.colors.primary : "transparent",
                }}
              >
                <Text
                  style={[
                    theme.typography.body,
                    {
                      fontFamily:
                        activeTab === tab
                          ? "Figtree_700Bold"
                          : "Inter_500Medium",
                      color:
                        activeTab === tab
                          ? theme.colors.background
                          : theme.colors.textSecondary,
                      textAlign: "center",
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          {activeTab === "Stats" && renderStatsContent()}
          {activeTab === "Posts" && renderPostsContent()}
          {activeTab === "Dashboard" && renderDashboardContent()}
        </View>
      </ScrollView>
    </View>
  );
}
