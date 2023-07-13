import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "./QuestionCard";

const ShareList = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5000/share/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data:", data); // Log the received data
        setQuestionList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

 
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!questionList) {
    return <p>List not found.</p>;
  }

  return (
    <div>
      <QuestionCard list={questionList} />
    </div>
  );
};

export default ShareList;
