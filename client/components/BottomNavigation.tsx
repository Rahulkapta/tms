import { Icons } from "@/assets/icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";



interface BottomNavigationProps {
  activeTab?: "projects" | "people" | "inbox" | "settings";
}

export default function BottomNavigation({
  activeTab = "projects",
}: BottomNavigationProps) {
  const tabs = [
    {
      id: "projects",
      label: "Projects",
      icon: Icons.project,
      route: "/(main)",
    },
    {
      id: "people",
      label: "People",
      icon: Icons.people,
      route: "/people",
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: Icons.inbox,
      route: "/inbox",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Icons.settings,
      route: "/settings",
    },
  ];

  const handleTabPress = (route: string, tabId: string) => {
    if (activeTab !== tabId) {
      router.replace(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route, tab.id)}
            >
              <View
                style={[
                  styles.tabIcon,
                  activeTab === tab.id
                    ? styles.activeTabIconBackground
                    : styles.inactiveTabIconBackground,
                ]}
              >
                <IconComponent width={26} height={26} stroke={Colors.iconContainer.icon}/>
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id
                    ? styles.activeTabLabel
                    : styles.inactiveTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* <View style={styles.spacer} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f2f5",
    paddingHorizontal: 16,
    // paddingBottom: 12,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  tabIcon: {
    width: 50,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabIconBackground: {
    backgroundColor: Colors.iconContainer.iconBackground,
  },
  inactiveTabIconBackground: {
    backgroundColor: "transparent",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.015,
  },
  activeTabLabel: {
    color: "#111418",
  },
  inactiveTabLabel: {
    color: "#60758a",
  },
  spacer: {
    height: 20,
    backgroundColor: "#ffffff",
  },
});
