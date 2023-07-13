import QuestionCard from "./QuestionCard"
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import SpinnerComponent from "./SpinnerComponent";

export default function Question() {
  const [list, setList] = useState(null);
  const { id } = useParams();
  const [own, setOwn] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
  
    fetch(`http://localhost:5000/list/own/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Unauthorized');
        }
      })
      .then((data) => {
        console.log("Received data onwer:", data); // Log the received data
        setList(data);
        setLoading(false);
        setOwn(data.own);
        addRecent();
      })
      .catch((error) => {
        console.error(error);
        if (error.message === 'Unauthorized') {
          getShareList();
        } else {
          setLoading(false);
        }
      });
  
    const getShareList = () => {
      fetch(`http://localhost:5000/share/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Received data shared:", data); // Log the received data
          setOwn(false);
          setList(data);
          setLoading(false);

        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
    const addRecent = () => {
      // Make a POST request to the API endpoint to add the list to recent
      fetch(`http://localhost:5000/users/addRecent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ list_id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error(error);
        });
    };
  }, [id]);
  
  if (loading) {
    return <SpinnerComponent/>;
  }
  if (!list) {
    return <p>No list found</p>;
  }
  return <QuestionCard list={list} own={own} />;
}
