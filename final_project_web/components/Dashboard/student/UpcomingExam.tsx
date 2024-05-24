import React, { useState, useEffect } from 'react';
import { useGetUpcomingExamsQuery } from "./../../../store/exam/upcoming-exam-api"; 
import Image from "next/image";
import { useRouter } from "next/router";

const UpcomingExams = () => {
  const router = useRouter();
  const { data: upcomingExams, isLoading } = useGetUpcomingExamsQuery(); 
  const [timeLeft, setTimeLeft] = useState(0); 
  const [timerColor, setTimerColor] = useState(""); 

  useEffect(() => {
    if (upcomingExams && new Date(upcomingExams.date_and_time) > new Date()) {
      const timerInterval = setInterval(() => {
        const currentTime = new Date(); 
        const examTime = new Date(upcomingExams.date_and_time); 
        const differenceInMilliseconds = examTime.getTime() - currentTime.getTime();
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        setTimeLeft(differenceInSeconds); 
        if (differenceInSeconds <= 3600) {
          setTimerColor("text-red-500"); 
        } else {
          setTimerColor(""); 
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    } else {
      setTimeLeft(0);
    }
  }, [upcomingExams]);

  const formatTime = (seconds:number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-center rounded-xl shadow-md p-4 md:w-3/4">
      {timeLeft === 0 ? (
        <div className="flex flex-col justify-between h-full">
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <h3 className="mt-8 text-md font-semibold">No Upcoming Exams</h3>
              <Image
                width={64}
                height={64}
                src="/images/noExam.png"
                alt=""
                className="text-primary w-20 h-20"
              />
            </div>
            <p className="text-sm">You have no upcoming exams scheduled.</p>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-lg text-black h-[130px] transition-shadow duration-300 ease-in-out cursor-pointer bg-slate-200">
          <div className="flex items-center space-x-4 h-full">
            <div className="flex-shrink-0">
              <Image
                width={64}
                height={64}
                src="/images/noExam.png"
                alt=""
                className="text-primary w-20 h-20"
              />
            </div>
            <div className="flex flex-col justify-between h-full gap-4">
              <div className='flex flex-col gap-4'>
                <h3 className="text-md font-semibold">
                  Upcoming Exam: {upcomingExams?.title}
                </h3>
                {/* <p className="text-sm">Date: {upcomingExams?.date_and_time}</p> */}
                <div className="flex items-center justify-center">
                <div className={`text-sm border-2 border-primary p-2 m-2 rounded-md ${timerColor}`}>
                  Time Left: {formatTime(timeLeft)}
                </div>
                </div>
              </div>
              <div>
                <p className="text-sm">Get ready to showcase your skills!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingExams;