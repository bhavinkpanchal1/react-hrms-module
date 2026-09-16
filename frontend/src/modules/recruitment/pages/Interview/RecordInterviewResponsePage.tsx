import { Modal } from "@/shared/ui";
import type { Interview } from "../../types/interview.type";
import { InterviewResponseForm } from "../../components/InterviewResponseForm";
const RecordInterviewResponsePage=({isOpen,close,interview}:{isOpen:boolean;close:()=>void;interview:Interview|null})=>interview?<Modal isOpen={isOpen} onClose={close} title="Interview Feedback"><InterviewResponseForm onSubmit={close} onCancel={close} isSubmitting={false} defaultValues={{feedback:interview.feedback}}/></Modal>:null;
export default RecordInterviewResponsePage;
