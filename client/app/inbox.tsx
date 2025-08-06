import BottomNavigation from "@/components/BottomNavigation";
import { getInitials } from "@/utils/common.utils";
import React from "react";
import { SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";

// Mock data for activity feed
const mockActivities = [
  {
    id: "1",
    title: 'New comment on "Design System"',
    firstName: "kabir",
    // lastName: "Bhagat",
    project: "Project: Design System",
    timeAgo: "10m",
    // avatar:
    //   "https://lh3.googleusercontent.com/aida-public/AB6AXuAhHzqlSEOxmQIXMa0_qoLmVl2lSZ2mx1UvEf7UoMILGSm9OfPJh2CeyvjU5FWppuoc1mJmp2tgCA_ucPa0C_ge8YrG4KXxYgn2Q1oZGlJC8x9E3Ejwsv4zoAF2mX1ekCNcqMrYjqpGoVQa9eQKykWuGKuH5SCBfJfLAiaevdWJ0GYboZ4ZnrX_yMhoBXxdh3G_gLnVbsMYfJABmlb_XlZ7YUayAu0iTtGgoq0kNqynnK2gVPryNKYomleKTF20jCALtITAIkA4t6A",
  },
  {
    id: "2",
    firstName: "Rahul",
    lastName: "Kapta",
    title: 'New comment on "Design System"',
    project: "Project: Design System",
    timeAgo: "10m",
    // avatar:
    //   "https://lh3.googleusercontent.com/aida-public/AB6AXuC8TkjqMz3Jnf1PtqF-ebOXNdpMRgm3GxSproqssjfTfP0eq1XJUJlO7pkQu_GMjjh9M-cqpJGExk0q4k7ZvoRqMBakCTUcCWmMizXvuZYn-fZ9W3iltre1bPGp-lSXTliRRNzoupunM3OezZAiETvMKLd-M-qafbTKJ8-g-7MD-YbS-zkTF3fbv2YE0MoNDwEjlGnyhkLzAx8T6DFbxHOycybvmPucCigyNZ3O9kjOVG50jzcxWNcnT2b9NBgMPU8VNV3A3qJjF3c",
  },
  {
    id: "3",
     firstName: "Abhi",
    lastName: "Kapta",
    title: 'New comment on "Design System"',
    project: "Project: Design System",
    timeAgo: "10m",
    // avatar:
    //   "https://lh3.googleusercontent.com/aida-public/AB6AXuA-tMFKxmFuKDizpldxZ0crSGBAvsEHiic1ugwnVg7F9lOx6bo3HnB7QaGvA7KM_wlq3Je8GbOUJO4eLWgnnP_kHsx6UMW4G2eZarT2HbPmlWo6AwcnSpUb-TRBh4hI1_G5YUG8T2iWuA7TUJXPVT1QnHL7TLI5j9rtzBCeJz81tHUY2i5DAtNRuuvJvl4CQXfJS6kj70Oc7i07n5Hgbozv4cWT4VfIU86gcgs93FLkFe-5YNIPsdsqxrXOK-ydRaAU2kmv5FrSfks",
  },
];

export default function InboxScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>

        {/* Activity Feed */}
        <ScrollView
          style={styles.activityList}
          showsVerticalScrollIndicator={false}
        >
          {mockActivities.map((activity) => {
            const initials = getInitials(activity.firstName, activity.lastName);
            return (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityContent}>
                  {activity.avatar ? (
                    <Image
                      source={{ uri: activity.avatar }}
                      style={styles.activityAvatar}
                    />
                  ) : (
                    <View style={styles.initialsCircle}>
                      <Text style={styles.initialsText}>{initials}</Text>
                    </View>
                  )}
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle} numberOfLines={1}>
                      {activity.title}
                    </Text>
                    <Text style={styles.activityProject} numberOfLines={2}>
                      {activity.project}
                    </Text>
                  </View>
                </View>
                <Text style={styles.activityTime}>{activity.timeAgo}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="inbox" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111518",
    letterSpacing: -0.015,
    textAlign: "center",
  },
  activityList: {
    flex: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    minHeight: 72,
    paddingVertical: 8,
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  activityAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  initialsCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.iconContainer.iconBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 20,
    color: Colors.iconContainer.icon,
    fontWeight: "bold",
  },
  activityInfo: {
    flex: 1,
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111518",
    lineHeight: 20,
  },
  activityProject: {
    fontSize: 14,
    fontWeight: "400",
    color: "#60768a",
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: "400",
    color: "#60768a",
    flexShrink: 0,
  },
});
