'use client';
import FullFeaturedCrudGrid from '@/app/components/ui/tables/TabelaCliente';
import Loading from '@/app/components/loading/Loading';
import ContentWrapper from '@/app/components/ui/wrapper/ContentWrapper';
import { useUsers } from '@/hooks/queries';

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Clientes' },
];

export default function Produtos() {
  const { data, isLoading } = useUsers();

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return <FullFeaturedCrudGrid data={data} isLoading={isLoading} />;
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
