import { useMemo, ReactNode } from "react";
import { Box, Divider } from "@mui/material";
import { GroupFamilyInvoicesOpen, MostSoldProducts, TopClientsDto } from "@/types";
import Text from "../text/Text";
import Loading from "../../loading/Loading";
import { FamiliesOpen } from "../graphics/FamiliesOpen";
import { TopClients } from "../graphics/TopClients";
import { TopProducts } from "../graphics/TopProducts";

interface ContentTwoProps {
  isLoadingGroupFamilyInvoicesOpen: boolean;
  groupFamilyInvoicesOpen: GroupFamilyInvoicesOpen[];
  isMobile: boolean;
  overflowStyle: Record<string, unknown>;
  isLoadingMostSoldProducts: boolean;
  mostSoldProducts: MostSoldProducts[];
  isLoadingTopClients: boolean;
  topClients: TopClientsDto[];
}

// Dimensões padronizadas para todos os cards
const CARD_DIMENSIONS = {
  height: {
    mobile: "400px",
    desktop: "inherit",
  },
  padding: { xs: "1rem", sm: "1.5rem" },
  gap: { xs: 1, sm: 2 },
} as const;

// Componente Card reutilizável
interface CardProps {
  title: string;
  children: ReactNode;
  isLoading: boolean;
  width?: { xs: string; sm?: string; md?: string };
  overflowStyle?: Record<string, unknown>;
}

const Card = ({ title, children, isLoading, width, overflowStyle }: CardProps) => (
  <Box
    sx={{
      width: width || { xs: "100%" },
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: CARD_DIMENSIONS.padding,
      display: "flex",
      flexDirection: "column",
      height: { xs: CARD_DIMENSIONS.height.mobile, sm: CARD_DIMENSIONS.height.desktop },
    }}
  >
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: "#fff",
        pb: 1,
      }}
    >
      <Text variant="subtitle2" color="#596772" fontWeight="bold">
        {title}
      </Text>
      <Divider />
    </Box>

    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        ...overflowStyle,
        mt: 1,
      }}
    >
      {isLoading ? <Loading minHeight={10} /> : children}
    </Box>
  </Box>
);

const ContentTwo = ({
  isLoadingGroupFamilyInvoicesOpen,
  groupFamilyInvoicesOpen,
  isMobile,
  overflowStyle,
  isLoadingMostSoldProducts,
  mostSoldProducts,
  isLoadingTopClients,
  topClients,
}: ContentTwoProps) => {
  // Ordenar famílias por valor (maior para menor) - memoizado para performance
  const sortedFamilies = useMemo(
    () => [...groupFamilyInvoicesOpen].sort((a, b) => b.value - a.value),
    [groupFamilyInvoicesOpen]
  );

  // Renderizar lista de famílias
  const renderFamilies = useMemo(
    () =>
      sortedFamilies.map((family) => (
        <FamiliesOpen
          key={family._id}
          name={family.name}
          ownerName={family.ownerName}
          ownerAvatar={family.ownerAvatar}
          value={family.value}
        />
      )),
    [sortedFamilies]
  );

  // Renderizar lista de produtos
  const renderProducts = useMemo(
    () => mostSoldProducts.map((product) => <TopProducts key={product._id} {...product} />),
    [mostSoldProducts]
  );

  // Renderizar lista de clientes
  const renderClients = useMemo(
    () => topClients.map((client) => <TopClients key={client._id} {...client} />),
    [topClients]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 1.5, md: 3 },
        height: { xs: "auto", md: "24rem" },
        marginInline: isMobile ? "0" : { xs: "0.25rem", sm: "0.5rem" },
      }}
    >
      {/* Famílias em Aberto */}
      <Card
        title="Famílias em aberto"
        isLoading={isLoadingGroupFamilyInvoicesOpen}
        width={{ xs: "100%", sm: "50%" }}
        overflowStyle={overflowStyle}
      >
        {renderFamilies}
      </Card>

      {/* Produtos Mais Vendidos */}
      <Card
        title="Produtos mais vendidos"
        isLoading={isLoadingMostSoldProducts}
        width={{ xs: "100%", sm: "50%" }}
        overflowStyle={overflowStyle}
      >
        {renderProducts}
      </Card>

      {/* Top Clientes */}
      <Card
        title="Top clientes"
        isLoading={isLoadingTopClients}
        width={{ xs: "100%", sm: "50%" }}
        overflowStyle={overflowStyle}
      >
        {renderClients}
      </Card>
    </Box>
  );
};

export default ContentTwo;
