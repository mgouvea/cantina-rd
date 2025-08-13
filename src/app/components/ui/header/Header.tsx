"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useUserStore } from "@/contexts";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../snackbar/SnackbarProvider";
import { useMediaQuery, useTheme } from "@mui/material";
import { SidebarContext } from "../sidebar/Sidebar";

const settings = ["Perfil", "Sair"];
const drawerWidth = 260;

function Header() {
  const { userLogged, updateUserLogged } = useUserStore();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const sidebarContext = React.useContext(SidebarContext);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting: string) => {
    setAnchorElUser(null);

    if (setting === "Sair") {
      updateUserLogged(null);

      localStorage.removeItem("user-storage");
      router.replace("/");

      showSnackbar({
        severity: "success",
        message: "Logout realizado com sucesso",
      });
    } else if (setting === "Perfil") {
      showSnackbar({
        severity: "info",
        message: "Perfil em desenvolvimento",
      });
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        background: "#fff",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={sidebarContext.toggleDrawer}
                sx={{ color: "#333" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* Espaço vazio para manter o avatar à direita */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userLogged?.name} src={userLogged?.urlImage} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
