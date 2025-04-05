"use client";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import Image from "next/image";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import React, { useMemo, useCallback } from "react";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import Text from "../text/Text";
import { Box, Drawer, List, Toolbar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export function NewSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const drawerWidth = 260;

  // Define a type for navigation item titles to ensure type safety
  type NavigationTitle = "Dashboard" | "Faturas" | "Clientes" | "Grupo Familiar" | "Gestores" | "Produtos" | "Categorias";

  // Memoize the navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () => [
      { title: "Dashboard" as NavigationTitle, route: "/dashboard" },
      { title: "Faturas" as NavigationTitle, route: "/faturas" },
      { title: "Clientes" as NavigationTitle, route: "/clientes" },
      { title: "Grupo Familiar" as NavigationTitle, route: "/grupo-familiar" },
      { title: "Gestores" as NavigationTitle, route: "/gestor" },
      { title: "Produtos" as NavigationTitle, route: "/produtos" },
      { title: "Categorias" as NavigationTitle, route: "/categorias" },
    ],
    []
  );

  // Memoize the icons mapping to prevent recreation on each render
  const icons = useMemo(
    () => ({
      Dashboard: <DashboardCustomizeRoundedIcon />,
      Faturas: <LocalAtmOutlinedIcon />,
      Clientes: <SupervisorAccountRoundedIcon />,
      "Grupo Familiar": <FamilyRestroomOutlinedIcon />,
      Gestores: <AdminPanelSettingsOutlinedIcon />,
      Produtos: <FastfoodRoundedIcon />,
      Categorias: <CategoryIcon />,
    } as Record<NavigationTitle, JSX.Element>),
    []
  );

  // Use useCallback for event handlers to maintain referential equality
  const handleSelectMenu = useCallback(
    (route: string) => {
      router.replace(route);
    },
    [router]
  );

  // Memoize the NavigationButton component to prevent unnecessary re-renders
  const NavigationButton = useCallback(
    ({ title, route }: { title: NavigationTitle; route: string }) => {
      const isSelected = pathname.startsWith(route);

      return (
        <Box
          key={title}
          onClick={() => handleSelectMenu(route)}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "90%",
            margin: "1rem 0 0 1rem",
            cursor: "pointer",
            borderRadius: "12px",
            ":hover > .main-button": {
              backgroundColor: "success.main",
            },
            ":hover .title-text": {
              color: "#FFF",
            },
          }}
        >
          <Box
            className="main-button"
            sx={{
              display: "flex",
              height: "43px",
              gap: "8px",
              alignItems: "center",
              padding: "7px 24px",
              backgroundColor: isSelected ? "success.main" : "transparent",
              color: isSelected ? "#fff" : "#666666",
              borderRadius: "12px",
              ":hover": {
                color: "#FFF",
              },
            }}
          >
            {icons[title]}
            <Text
              className="title-text"
              sx={{
                color: isSelected ? "#fff" : "#666666",
                fontWeight: isSelected ? 600 : "normal",
                ":hover": {
                  color: "#FFF",
                },
              }}
            >
              {title}
            </Text>
          </Box>
        </Box>
      );
    },
    [pathname, handleSelectMenu, icons]
  );

  // Memoize the drawer content to prevent unnecessary re-renders
  const drawerContent = useMemo(
    () => (
      <Box sx={{ width: drawerWidth }}>
        <Toolbar sx={{ justifyContent: "center", padding: "0.5rem 0 0 0" }}>
          <Image
            src="/cantinaRd.png"
            width={110}
            height={110}
            alt="logo da cantina realeza divina"
          />
        </Toolbar>
        <List>
          {navigationItems.map(({ title, route }) => (
            <NavigationButton key={title} title={title} route={route} />
          ))}
        </List>
      </Box>
    ),
    [navigationItems, NavigationButton, drawerWidth]
  );

  return (
    <Drawer
      variant="permanent"
      disableScrollLock={true}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
