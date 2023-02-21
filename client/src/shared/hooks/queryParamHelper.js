import { useSearchParams, createSearchParams } from 'react-router-dom';

export const useQueryParamHelper = param => {
  const [searchParams, setSearchParams] = useSearchParams();

  const open = () => {
    setSearchParams(createSearchParams({ modal: param }));
  };
  const close = () => {
    searchParams.delete('modal');
    setSearchParams(createSearchParams(searchParams));
  };
  const isOpen = () => param === searchParams.get('modal');

  return { open, close, isOpen };
};
