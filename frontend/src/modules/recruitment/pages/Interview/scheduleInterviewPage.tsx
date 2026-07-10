import { Modal } from "@/shared/ui";

type ScheduleInterviewPageProps = {
  isOpen: boolean;
  close: () => void;
  title: string;
};

const ScheduleInterviewPage = ({
  isOpen,
  close,
  title,
}: ScheduleInterviewPageProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} title={title}>
        <>Schedule</>
      </Modal>
    </>
  );
};

export default ScheduleInterviewPage;
