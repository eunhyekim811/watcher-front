// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { motion } from "framer-motion";

// const mockSubjects = ["운영체제", "인공지능", "리눅스프로그래밍"];
// const mockStudents = {
//   "운영체제": ["201918366", "201821688"],
//   "인공지능": ["학생A", "학생B"],
//   "리눅스프로그래밍": ["학생C", "학생D", "학생E"]
// };
// const mockAssignments = ["hw10", "hw11", "hw12"];

// export default function CodeAnalysisDashboard() {
//   const [subjects, setSubjects] = useState(mockSubjects);
//   const [students, setStudents] = useState([]);
//   const [assignments, setAssignments] = useState(mockAssignments);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [codeFiles, setCodeFiles] = useState([]);
//   const [snapshots, setSnapshots] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedSnapshot, setSelectedSnapshot] = useState(null);
//   const [analysisData, setAnalysisData] = useState([]);

//   useEffect(() => {
//     if (selectedSubject) {
//       setStudents(mockStudents[selectedSubject] || []);
//     }
//   }, [selectedSubject]);

//   useEffect(() => {
//     if (selectedStudent && selectedAssignment) {  // 코드 파일 목록 가져오기
//       fetch(`/code_snapshots/${selectedStudent}/${selectedAssignment}/files.json`)
//         .then(res => res.json())
//         .then(data => setCodeFiles(data));
//     }
//   }, [selectedStudent, selectedAssignment]);

//   useEffect(() => {
//     if (selectedFile) {  // 스냅샷 목록 가져오기
//       fetch(`/code_snapshots/${selectedStudent}/${selectedAssignment}/${selectedFile}/snapshots.json`)
//         .then(res => res.json())
//         .then(data => setSnapshots(data));
//     }
//   }, [selectedFile]);

//   useEffect(() => {
//     if (selectedSnapshot) {  // 스냅샷 크기 가져오기
//       fetch(`/code_snapshots/${selectedStudent}/${selectedAssignment}/${selectedFile}/${selectedSnapshot}.txt`)
//         .then(res => res.text())
//         .then(content => setAnalysisData([{ timestamp: selectedSnapshot, size: content.length }]));
//     }
//   }, [selectedSnapshot]);

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="text-right text-2xl font-bold text-black mb-6">Watcher</div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-black mb-4">과목 선택</h2>
//           {subjects.map(subject => (
//             <Button key={subject} className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setSelectedSubject(subject)}>{subject}</Button>
//           ))}
//         </div>
//         {selectedSubject && (
//           <div className="col-span-2 mt-4">
//             <h2 className="text-xl font-bold text-black mb-4">학생 선택</h2>
//             {students.map(student => (
//               <Button key={student} className="bg-blue-500 hover:bg-blue-600 text-white m-1" onClick={() => setSelectedStudent(student)}>{student}</Button>
//             ))}
//           </div>
//         )}
//         {selectedStudent && (
//           <div className="col-span-2 mt-4">
//             <h2 className="text-xl font-bold text-black mb-4">과제 선택</h2>
//             {assignments.map(assignment => (
//               <Button key={assignment} className="bg-blue-500 hover:bg-blue-600 text-white m-1" onClick={() => setSelectedAssignment(assignment)}>{assignment}</Button>
//             ))}
//           </div>
//         )}
//         {selectedAssignment && (
//           <div className="col-span-2 grid grid-cols-2 gap-4 mt-6">
//             <Card>
//               <CardContent>
//                 <h3 className="text-lg font-bold text-black">코드 파일 목록</h3>
//                 {codeFiles.map(file => (
//                   <Button key={file} className="bg-blue-400 hover:bg-blue-500 text-white" onClick={() => setSelectedFile(file)}>{file}</Button>
//                 ))}
//               </CardContent>
//             </Card>
//             {selectedFile && (
//               <Card>
//                 <CardContent>
//                   <h3 className="text-lg font-bold text-black">스냅샷 목록</h3>
//                   {snapshots.map(snapshot => (
//                     <Button key={snapshot} className="bg-blue-300 hover:bg-blue-400 text-white" onClick={() => setSelectedSnapshot(snapshot)}>{snapshot}</Button>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         )}
//         {selectedSnapshot && (
//           <div className="col-span-2 grid grid-cols-2 gap-4 mt-6">
//             <Card>
//               <CardContent>
//                 <h3 className="text-lg font-bold text-black">파일 크기 변화</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={analysisData}>
//                     <XAxis dataKey="timestamp" stroke="#000000" />
//                     <YAxis stroke="#000000" />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="size" stroke="#2563EB" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent>
//                 <h3 className="text-lg font-bold text-black">코드 스냅샷</h3>
//                 <motion.div layout>
//                   <pre className="text-sm bg-gray-100 p-2 rounded text-black">{selectedSnapshot}</pre>
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
