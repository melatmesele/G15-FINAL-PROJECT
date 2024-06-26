// src/pages/TeachersPage.tsx
import React from "react";
import dynamic from "next/dynamic";

const TeacherList = dynamic(
  () => import("@/components/components/Tables/AllTeacherAdmin"),
  {
    ssr: false,
  }
);
const TeachersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-semibold mb-4">Teachers List</h1>
      <TeacherList />
    </div>
  );
};

export default TeachersPage;