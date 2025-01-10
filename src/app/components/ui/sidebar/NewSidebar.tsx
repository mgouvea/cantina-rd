'use client';

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import Image from 'next/image';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import React, { useState } from 'react';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import Text from '../text/Text';
import { Box, Drawer, List, Toolbar, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

export function NewSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const router = useRouter();

  const drawerWidth = 260;

  const handleClick = (route: string) => {
    router.replace(`/painel/${route}`);
  };

  const navigationItems = [
    { title: 'Dashboard', route: '' },
    { title: 'Faturas', route: 'faturas' },
    {
      title: 'Clientes',
      route: 'clientes',
      // submenus: [
      //   { title: 'Listar clientes', route: 'clientes' },
      //   { title: 'Adicionar cliente', route: 'clientes/novo' },
      // ],
    },
    { title: 'Grupo Familiar', route: 'grupo-familiar' },
    {
      title: 'Gestores',
      route: 'gestor',
      // submenus: [
      //   { title: 'Listar gestores', route: 'gestor' },
      //   { title: 'Adicionar gestor', route: 'gestor/novo' },
      // ],
    },
    {
      title: 'Produtos',
      route: 'produtos',
      submenus: [
        { title: 'Listar produtos', route: 'produtos' },
        { title: 'Adicionar produto', route: 'produtos/novo' },
      ],
    },
  ];

  const NavigationButton = ({
    title,
    route,
    submenus = [],
  }: {
    title: string;
    route: string;
    submenus?: { title: string; route: string }[];
  }) => {
    const isSelected =
      (title === 'Dashboard' && pathname === '/painel') ||
      (title !== 'Dashboard' && pathname.startsWith(`/painel/${route}`)) ||
      submenus.some((sub) => pathname.startsWith(`/painel/${sub.route}`));

    const icons: Record<string, JSX.Element> = {
      Dashboard: <DashboardCustomizeRoundedIcon />,
      Faturas: <LocalAtmOutlinedIcon />,
      Clientes: <SupervisorAccountRoundedIcon />,
      'Grupo Familiar': <FamilyRestroomOutlinedIcon />,
      Gestores: <AdminPanelSettingsOutlinedIcon />,
      Produtos: <FastfoodRoundedIcon />,
    };

    return (
      <Box
        key={title}
        onClick={() => handleClick(route)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '90%',
          margin: '1rem 0 0 1rem',
          cursor: 'pointer',
          borderRadius: '12px',
          ':hover > .main-button': {
            backgroundColor: 'success.main',
          },
        }}
      >
        <Box
          className="main-button"
          sx={{
            display: 'flex',
            height: '43px',
            gap: '8px',
            alignItems: 'center',
            padding: '7px 24px',
            backgroundColor: isSelected ? 'success.main' : 'transparent',
            color: isSelected ? '#fff' : '#666666',
            borderRadius: '12px',
            ':hover': {
              color: isSelected ? '#fff' : '#FFF',
            },
          }}
        >
          {icons[title]}
          <Text
            sx={{
              color: isSelected ? '#fff' : '#666666',
              fontWeight: isSelected ? 600 : 'normal',
              ':hover': {
                color: isSelected ? '#fff' : '#FFF',
              },
            }}
          >
            {title}
          </Text>
        </Box>
        {(isSelected ||
          submenus.some((sub) =>
            pathname.startsWith(`/painel/${sub.route}`)
          )) &&
          submenus.length > 0 && (
            <Box sx={{ paddingLeft: '24px', marginTop: '8px' }}>
              {submenus.map((submenu) => (
                <SubmenuButton
                  key={submenu.title}
                  title={submenu.title}
                  isSelected={pathname === `/painel/${submenu.route}`} // Comparação exata da rota
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar a propagação do clique para o botão principal
                    handleClick(submenu.route);
                  }}
                />
              ))}
            </Box>
          )}
      </Box>
    );
  };

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
        {navigationItems.map(({ title, route, submenus }) => (
          <NavigationButton
            key={title}
            title={title}
            route={route}
            submenus={submenus}
          />
        ))}
      </List>
    </Box>
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
          boxSizing: 'border-box',
          border: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

const SubmenuButton = ({
  title,
  isSelected,
  onClick,
}: {
  title: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      padding: '8px 24px',
      cursor: 'pointer',
      borderRadius: '16px',
      marginBottom: '8px',
    }}
  >
    <Text
      sx={{
        color: isSelected ? '#f6bb04' : '#666666',
        fontWeight: isSelected ? 700 : 'normal',
        ':hover': {
          color: '#f6bb04',
          fontWeight: 700,
        },
      }}
    >
      {title}
    </Text>
  </Box>
);
