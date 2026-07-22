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
import ListingsPage from "../pages/ListingsPage";
import HouseDetailPage from "../pages/HouseDetailPage";
import CompareHousesPage from "../pages/CompareHousesPage";
import LifestyleSetupPage from "../pages/LifestyleSetupPage";
import MyPage from "../pages/MyPage";
import {
  MembersPage,
  CleaningRotationPage,
  NotificationsPage,
  SettingsPage,
  ProfilePage,
} from "../pages/MySubPages";
import AnnouncementComposePage from "../pages/AnnouncementComposePage";
import AnonBoardPage from "../pages/AnonBoardPage";
import TourRequestPage from "../pages/TourRequestPage";
import MoveInRequestPage from "../pages/MoveInRequestPage";
import MemberChatPage from "../pages/MemberChatPage";
import HouseInfoPage from "../pages/HouseInfoPage";
import LordHomePage from "../pages/LordHomePage";
import LordHousesPage from "../pages/LordHousesPage";
import LordHouseEditPage from "../pages/LordHouseEditPage";
import LordInvitePage from "../pages/LordInvitePage";
import LordApplicantsPage from "../pages/LordApplicantsPage";
import LordApplicantDetailPage from "../pages/LordApplicantDetailPage";
import LordReviewsPage from "../pages/LordReviewsPage";

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
    case "listings":
      return <ListingsPage />;
    case "houseDetail":
      return <HouseDetailPage id={id} />;
    case "compareHouses":
      return <CompareHousesPage />;
    case "lifestyleSetup":
      return <LifestyleSetupPage />;
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
    case "announcementCompose":
      return <AnnouncementComposePage />;
    case "anonBoard":
      return <AnonBoardPage />;
    case "tourRequest":
      return <TourRequestPage id={id} />;
    case "moveInRequest":
      return <MoveInRequestPage id={id} />;
    case "memberChat":
      return <MemberChatPage memberId={id || undefined} />;
    case "houseInfo":
      return <HouseInfoPage />;

    /* ===== 임대인 모드 ===== */
    case "lordHome":
      return <LordHomePage />;
    case "lordHouses":
      return <LordHousesPage />;
    case "lordHouseEdit":
      return <LordHouseEditPage id={id} />;
    case "lordInvite":
      return <LordInvitePage id={id} />;
    case "lordApplicants":
      return <LordApplicantsPage />;
    case "lordApplicantDetail":
      return <LordApplicantDetailPage id={id} />;
    case "lordReviews":
      return <LordReviewsPage />;
    default:
      return <HomePage />;
  }
}
