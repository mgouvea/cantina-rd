'use client';

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import Text from '../text/Text';
import { useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Divider,
  Box,
  Toolbar,
  Collapse,
} from '@mui/material';

const drawerWidth = 260;

interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  href: string;
}

interface MenuCategory {
  category: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentRoute = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Verifica se a rota é exatamente igual a /painel
  const isActive = (path: string) => currentRoute === path;

  const colorIcons = 'error.main';

  const menuItems: MenuCategory[] = [
    {
      category: 'Dashboard',
      items: [
        {
          text: 'Início',
          icon: <DashboardCustomizeRoundedIcon sx={{ color: colorIcons }} />,
          href: '/painel', // Seleciona apenas se a rota for exatamente essa
        },
      ],
    },
    {
      category: 'Clientes',
      icon: <SupervisorAccountRoundedIcon />,
      items: [
        {
          text: 'Listar cliente',
          href: '/painel/clientes',
        },
        {
          text: 'Novo cliente',
          href: '/painel/clientes/novo',
        },
      ],
    },
    {
      category: 'Gestores',
      icon: <SupervisorAccountRoundedIcon />,
      items: [
        {
          text: 'Listar gestores',
          href: '/painel/gestor',
        },
        {
          text: 'Novo gestor',
          href: '/painel/gestor/novo',
        },
      ],
    },
    {
      category: 'Produtos',
      icon: <FastfoodRoundedIcon />,
      items: [
        {
          text: 'Listar produtos',
          href: '/painel/produtos',
        },
        {
          text: 'Cadastrar produto',
          href: '/painel/produtos/novo',
        },
      ],
    },
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar sx={{ justifyContent: 'center', padding: '0.5rem 0 0 0' }}>
        <Image
          src="/cantinaRd.png"
          width={110}
          height={110}
          alt="logo da cantina realeza divina"
        />
      </Toolbar>
      <List>
        {menuItems.map((menuCategory) => (
          <Box key={menuCategory.category}>
            {menuCategory.items ? (
              <>
                <ListItem
                  onClick={() => toggleMenu(menuCategory.category)}
                  sx={{
                    backgroundColor: isActive(menuCategory.items[0].href)
                      ? theme.palette.error.main
                      : 'inherit',
                    color: isActive(menuCategory.items[0].href)
                      ? '#fff'
                      : 'inherit',
                    cursor: 'pointer',
                    padding: '8px 16px', // Mantém o efeito de botão
                    borderRadius: '12px', // Borda arredondada
                    width: 'auto', // Permite ajustar o tamanho com base no conteúdo
                    minWidth: '200px', // Ajusta a largura mínima para não ficar muito curto
                    margin: '0 16px', // Margem lateral para afastar do conteúdo lateral
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(menuCategory.items[0].href)
                        ? '#fff'
                        : colorIcons,
                    }}
                  >
                    {menuCategory.icon}
                  </ListItemIcon>
                  <ListItemText primary={menuCategory.category} />
                  {openMenu === menuCategory.category ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItem>
                <Collapse
                  in={openMenu === menuCategory.category}
                  timeout="auto"
                  unmountOnExit
                >
                  {menuCategory.items.map((item) => (
                    <Link href={item.href} key={item.text} passHref>
                      <ListItem
                        component="a"
                        sx={{
                          paddingLeft: 8, // Ajuste o paddingLeft para dar efeito de indentação
                          fontWeight: isActive(item.href) ? 'bold' : 'normal',
                        }}
                      >
                        <ListItemText primary={item.text} />
                      </ListItem>
                    </Link>
                  ))}
                </Collapse>
              </>
            ) : (
              <>
                <Text
                  sx={{
                    margin: '16px 0 8px 16px',
                    color: theme.palette.text.primary,
                  }}
                >
                  {menuCategory.category}
                </Text>
                <Divider />
              </>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={handleDrawerToggle}
            edge="start"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            disableScrollLock={true}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                border: 'none',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          disableScrollLock={true}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
