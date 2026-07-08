import { useParams } from "react-router-dom";

const CandidateEditPage = () => {
  const param = useParams
  return (
    <>
    <h1>Candidate Edit Page ${param}</h1>
    </>
  )
}

export default CandidateEditPage;