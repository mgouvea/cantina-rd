'use client';

import ContentWrapper from '@/app/components/ui/wrapper/ContentWrapper';
import Loading from '@/app/components/loading/Loading';
import TabelaGestor from '@/app/components/ui/tables/TabelaGestor';
import { useAdmins } from '@/hooks/queries';

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Gestores' },
];

export default function Gestor() {
  const { data, isLoading } = useAdmins();

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return <TabelaGestor data={data} isLoading={isLoading} />;
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
