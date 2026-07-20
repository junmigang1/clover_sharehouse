import { useNavigation } from "../hooks/useNavigation";
import HomePage from "../pages/HomePage";
import ExpensesPage from "../pages/ExpensesPage";
import { AnnouncementsPage, AnnouncementDetailPage } from "../pages/AnnouncementsPage";
import CommunityPage from "../pages/CommunityPage";
import PostDetailPage from "../pages/PostDetailPage";
import MarketplacePage from "../pages/MarketplacePage";
import { ItemDetailPage, ItemChatPage } from "../pages/ItemDetailPage";
import AIPage from "../pages/AIPage";
import AIToolPage from "../pages/AIToolPage";
import MyPage from "../pages/MyPage";
import {
  MembersPage,
  CleaningRotationPage,
  NotificationsPage,
  SettingsPage,
  ProfilePage,
} from "../pages/MySubPages";

export default function Router() {
  const { current } = useNavigation();
  const id = (current.params?.id as string) ?? "";

  switch (current.key) {
    case "home":
      return <HomePage />;
    case "expenses":
      return <ExpensesPage />;
    case "announcements":
      return <AnnouncementsPage />;
    case "announcementDetail":
      return <AnnouncementDetailPage id={id} />;
    case "community":
      return <CommunityPage />;
    case "postDetail":
      return <PostDetailPage id={id} />;
    case "marketplace":
      return <MarketplacePage />;
    case "itemDetail":
      return <ItemDetailPage id={id} />;
    case "itemChat":
      return <ItemChatPage id={id} />;
    case "ai":
      return <AIPage />;
    case "aiTool":
      return <AIToolPage id={id} />;
    case "my":
      return <MyPage />;
    case "members":
      return <MembersPage />;
    case "cleaningRotation":
      return <CleaningRotationPage />;
    case "notifications":
      return <NotificationsPage />;
    case "settings":
      return <SettingsPage />;
    case "profile":
      return <ProfilePage />;
    default:
      return <HomePage />;
  }
}
