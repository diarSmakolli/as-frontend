import * as chakra from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../authContext/authContext";
import SidebarContent from "../layouts/SidebarContent"; 
import MobileNav from "../layouts/MobileNav";
import SettingsModal from "../components/settings/SettingsModal";
import Loader from "../../../commons/Loader";

const fontName = "Inter";

export default function Dashboard() {
  const { account, isLoading } = useAuth(); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthContextLoading = isLoading || false;

  if(isAuthContextLoading) {
    return <Loader />;
  }

  return (
    <>
      <chakra.Box minH="100vh" bg="rgb(241,241,241)">
        <chakra.Box display={{ base: "none", md: "block" }}>
          <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        </chakra.Box>
        {/* Mobile Sidebar: shown when menu is open */}
        <chakra.Box display={{ base: isSidebarOpen ? "block" : "none", md: "none" }} position="fixed" zIndex={999}>
          <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} onClose={() => setIsSidebarOpen(false)} />
        </chakra.Box>
        {/* MobileNav: always visible, passes menu toggle */}
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} onOpen={() => setIsSidebarOpen(true)} />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <chakra.Box ml={{ base: 0, md: 60 }} p="5"> 
          <chakra.Text
            color="gray.900"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontFamily={fontName}
            fontWeight="light"
            textAlign={{ base: "left", md: "left" }}
          >
            Good Afternoon, {account?.preferred_name || account?.first_name || "User"}
          </chakra.Text>
          <chakra.Text color="gray.700" mt={4}>
            Welcome to your dashboard.
          </chakra.Text>
        </chakra.Box>
      </chakra.Box>
    </>
  );
}