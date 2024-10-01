'use client';
import { Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const GenericBreadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const router = useRouter();

  const handleNavigation = (href: string | undefined) => {
    if (href) {
      router.push(href);
    }
  };

  // Função para definir o estilo de cada item com base na sua posição
  const getStyles = (index: number, isLink: boolean) => {
    const baseStyles = {
      fontWeight: index === 0 ? 600 : index === 1 ? 500 : 400,
      color:
        index === 0
          ? 'text.secondary'
          : index === 1
          ? 'text.secondary'
          : 'text.secondary',
      textDecoration: 'none',
    };

    // Adiciona cursor: pointer se o item for um link
    return isLink ? { ...baseStyles, cursor: 'pointer' } : baseStyles;
  };

  return (
    <Stack sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {items.map((item, index) =>
          item.href ? (
            <Link
              key={index}
              underline="none"
              sx={getStyles(index, true)}
              onClick={() => handleNavigation(item.href)}
            >
              {item.label}
            </Link>
          ) : (
            <Typography key={index} sx={getStyles(index, false)}>
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Stack>
  );
};

export default GenericBreadcrumbs;
