export const mockClasses = [
    {
      id: 1,
      name: '운영체제',
      year: 2024,
      semester: 1,
      professorId: 2, // professor@jbnu.ac.kr
        students: [ {
          id: 1,
          studentId: '201911111',
          name: '김학생',
          email: 'student@jbnu.ac.kr',
          lastActive: '2024-03-15 14:30:00'
        }, 
        {
          id: 8,
          studentId: '201918336',
          name: '학생1',
          email: '1111@jbnu.ac.kr',
          lastActive: '2024-03-15 14:30:00'
        }, 
        {
          id: 9,
          studentId: '201821688',
          name: '학생2',
          email: '2222@jbnu.ac.kr',
          lastActive: '2024-03-15 14:30:00'
        }
      ]
    },
    {
      id: 2,
      name: '인공지능',
      year: 2024,
      semester: 1,
      professorId: 2,
      students: [
        {
          id: 1,
          studentId: '201911111',
          name: '김학생',
          email: 'student@jbnu.ac.kr',
          lastActive: '2024-03-15 15:45:00'
        }
      ]
    }
  ];
  
  export const mockMonitoringData = {
    8: { // studentId
      name: '학생1',
      studentId: '201918336',
      totalCodeChanges: 'test ',
      totalCompiles: 'test ',
      assignments: [
        {
          id: '11',
          name: 'hw11',
          status: '완료',
          description: '과제 1 설명',
        },
        {
          id: '12',
          name: 'hw12',
          status: '진행 중',
          description: '과제 2 설명',
        },
        // ... 더 많은 과제 ...
      ]
    },
    1: { // studentId
      name: '김학생',
      studentId: '201911111',
      totalCodeChanges: 150,
      totalCompiles: 45,
      correctSubmissions: 8,
      submissionStats: {
        total: 20,
        stats: [
          { name: '정답', value: 8, color: '#4CAF50' },
          { name: '오답', value: 5, color: '#f44336' },
          { name: '컴파일 에러', value: 4, color: '#ff9800' },
          { name: '런타임 에러', value: 3, color: '#2196f3' }
        ]
      },
      recentSubmissions: [
        {
          id: 1,
          problemId: 'P1234',
          problemName: '배열의 합',
          submitTime: '2024-03-15 15:30:00',
          status: '정답',
          runtime: '0.5s',
          memory: '24MB'
        },
        {
          id: 2,
          problemId: 'P1235',
          problemName: '링크드리스트 역순',
          submitTime: '2024-03-15 15:00:00',
          status: '컴파일 에러',
          runtime: '-',
          memory: '-'
        },
        {
          id: 3,
          problemId: 'P1236',
          problemName: '이진트리 순회',
          submitTime: '2024-03-15 14:30:00',
          status: '런타임 에러',
          runtime: '-',
          memory: '-'
        }
      ],
      timeSeriesData: [
        {
          timestamp: '14:00',
          codeChanges: 5,
          compiles: 1
        },
        {
          timestamp: '14:10',
          codeChanges: 8,
          compiles: 2
        },
        {
          timestamp: '14:20',
          codeChanges: 12,
          compiles: 3
        },
        {
          timestamp: '14:30',
          codeChanges: 15,
          compiles: 4
        },
        {
          timestamp: '14:40',
          codeChanges: 18,
          compiles: 5
        },
        {
          timestamp: '14:50',
          codeChanges: 20,
          compiles: 6
        },
        {
          timestamp: '15:00',
          codeChanges: 22,
          compiles: 7
        },
        {
          timestamp: '15:10',
          codeChanges: 25,
          compiles: 8
        },
        {
          timestamp: '15:20',
          codeChanges: 28,
          compiles: 9
        },
        {
          timestamp: '15:30',
          codeChanges: 30,
          compiles: 10
        }
      ], 
      assignments: [
        {
          id: 'assignment1',
          name: '과제 1',
          status: '완료',
          description: '과제 1 설명',
        },
        {
          id: 'assignment2',
          name: '과제 2',
          status: '진행 중',
          description: '과제 2 설명',
        },
        // ... 더 많은 과제 ...
      ]
    }
  }; 