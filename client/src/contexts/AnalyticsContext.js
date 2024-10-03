import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState(() => {
    const savedAnalytics = localStorage.getItem('quizAnalytics');
    return savedAnalytics ? JSON.parse(savedAnalytics) : {
      startTime: null,
      endTime: null,
      answerTimes: {},
      textSelections: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('quizAnalytics', JSON.stringify(analytics));
  }, [analytics]);

  const startQuiz = () => {
    setAnalytics(prev => ({ ...prev, startTime: new Date().toISOString() }));
  };

  const endQuiz = () => {
    setAnalytics(prev => ({ ...prev, endTime: new Date().toISOString() }));
  };

  const recordAnswer = (questionId, answer) => {
    setAnalytics(prev => ({
      ...prev,
      answerTimes: {
        ...prev.answerTimes,
        [questionId]: { time: new Date().toISOString(), answer },
      },
    }));
  };

  const recordTextSelection = (selectedText) => {
    setAnalytics(prev => ({
      ...prev,
      textSelections: [...prev.textSelections, { text: selectedText, time: new Date().toISOString() }],
    }));
  };

  const clearAnalytics = () => {
    setAnalytics({
      startTime: null,
      endTime: null,
      answerTimes: {},
      textSelections: [],
    });
  };

  return (
    <AnalyticsContext.Provider value={{ analytics, startQuiz, endQuiz, recordAnswer, recordTextSelection, clearAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
