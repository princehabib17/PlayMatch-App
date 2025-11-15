import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Users, Trophy } from "lucide-react-native";
import { useTheme } from "@/utils/theme";
import GoldButton from "@/components/GoldButton";

const { width: screenWidth } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    icon: Search,
    title: "Find Games Near You",
    description:
      "Discover football matches happening in Manila. Filter by skill level, location, and time to find the perfect game.",
    color: "#3B82F6",
  },
  {
    id: 2,
    icon: Users,
    title: "Join & Play",
    description:
      "Reserve your spot instantly. Meet new players, build your network, and level up your game with every match.",
    color: "#43FF86",
  },
  {
    id: 3,
    icon: Trophy,
    title: "Track Your Progress",
    description:
      "Upload highlights, earn badges, climb leaderboards. Your football journey starts here.",
    color: "#D4AF37",
  },
];

function OnboardingSlide({ item, index }) {
  const theme = useTheme();
  const Icon = item.icon;

  return (
    <View
      style={{
        width: screenWidth,
        paddingHorizontal: theme.spacing.xl,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Icon Container */}
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: `${item.color}15`,
          borderWidth: 2,
          borderColor: item.color,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: theme.spacing.xxl,
        }}
      >
        <Icon size={60} color={item.color} strokeWidth={1.5} />
      </View>

      {/* Title */}
      <Text
        style={[
          theme.typography.h1,
          {
            fontFamily: "Figtree_700Bold",
            color: theme.colors.text,
            textAlign: "center",
            marginBottom: theme.spacing.md,
            letterSpacing: theme.typography.h1.letterSpacing,
          },
        ]}
      >
        {item.title}
      </Text>

      {/* Description */}
      <Text
        style={[
          theme.typography.bodyLarge,
          {
            fontFamily: "Inter_500Medium",
            color: theme.colors.textSecondary,
            textAlign: "center",
            lineHeight: 26,
            paddingHorizontal: theme.spacing.md,
          },
        ]}
      >
        {item.description}
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * screenWidth,
        animated: true,
      });
    } else {
      router.replace("/role-selection");
    }
  };

  const handleSkip = () => {
    router.replace("/role-selection");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
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
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.xl,
        }}
      >
        {/* Skip Button */}
        <View
          style={{
            paddingHorizontal: theme.spacing.xl,
            alignItems: "flex-end",
            marginBottom: theme.spacing.lg,
          }}
        >
          <TouchableOpacity onPress={handleSkip}>
            <Text
              style={[
                theme.typography.body,
                {
                  fontFamily: "Inter_600SemiBold",
                  color: theme.colors.textMuted,
                },
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {onboardingData.map((item, index) => (
            <OnboardingSlide key={item.id} item={item} index={index} />
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: theme.spacing.xl,
          }}
        >
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index
                    ? theme.colors.primary
                    : theme.colors.elevated,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <View style={{ paddingHorizontal: theme.spacing.xl }}>
          <GoldButton
            title={
              currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"
            }
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
}
