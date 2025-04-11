import { useNavigate, useBeforeUnload } from 'react-router-dom';

interface UseFormNavigationProps {
  isFormEdited: boolean;
  confirmMessage?: string;
}

export const useFormNavigation = ({
  isFormEdited,
  confirmMessage = '작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?'
}: UseFormNavigationProps) => {
  const navigate = useNavigate();

  // 브라우저 뒤로가기/새로고침 등으로 페이지 이탈 시 경고
  useBeforeUnload(
    (event) => {
      if (isFormEdited) {
        event.preventDefault();
        return confirmMessage;
      }
    }
  );

  const handleBackNavigation = () => {
    if (isFormEdited) {
      const confirmLeave = window.confirm(confirmMessage);
      if (!confirmLeave) {
        return;
      }
    }
    navigate(-1);
  };

  const navigateTo = (path: string) => {
    if (isFormEdited) {
      const confirmLeave = window.confirm(confirmMessage);
      if (!confirmLeave) {
        return;
      }
    }
    navigate(path);
  };

  return {
    handleBackNavigation,
    navigateTo
  };
}; 