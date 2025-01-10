'use client';

import { useApp } from '@/contexts';
import { useEffect } from 'react';
import TabelaGrupoFamiliar from '@/app/components/ui/tables/TabelaGrupoFamiliar';
import { useGroupFamily } from '@/hooks/queries/useGroupFamily.query';
import Loading from '@/app/components/loading/Loading';
import ContentWrapper from '@/app/components/ui/wrapper/ContentWrapper';

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Grupo Familiar' },
];

export default function GroupFamily() {
  const { data, isLoading } = useGroupFamily();
  const { setUserContext } = useApp();

  useEffect(() => {
    if (!isLoading && data) {
      setUserContext(data);
    }
  }, [data]);

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return <TabelaGrupoFamiliar data={data} isLoading={isLoading} />;
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
