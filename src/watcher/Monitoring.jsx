import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Box,
  IconButton,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { mockMonitoringData } from '../data/classe';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const colors = [
  "#8884d8", "#82ca9d", "#ff7300", "#ff0000", "#00ff00", 
  "#ff00ff", "#00ffff", "#8a2be2", "#ff4500", "#2e8b57"
];

const Monitoring = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [codeFiles, setCodeFiles] = useState([]); // 코드 파일 목록
  const [selectedCodeFile, setSelectedCodeFile] = useState(""); // 선택된 코드 파일
  const [snapshots, setSnapshots] = useState([]); // 스냅샷 목록
  const [selectedSnapshot, setSelectedSnapshot] = useState(""); // 선택된 스냅샷 파일
  const [fileContent, setFileContent] = useState(""); // 파일 내용
  const [graphData, setGraphData] = useState([]); // 스냅샷 크기 변화 데이터

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        // TODO: API 구현 필요 - GET /api/monitoring/{studentId}
        // Response: { 
        //   studentData: { name, studentId, totalCodeChanges, ... },
        //   submissionStats: { ... },
        //   timeSeriesData: [ ... ]
        // }
        // 목업 데이터 사용
        const data = mockMonitoringData[studentId];
        if (data) {
          setStudentData(data);
        } else {
          setError('학생 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('모니터링 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, [studentId]);

  useEffect(() => {
    if (selectedAssignment) {
      fetch(`${backendUrl}/graphdata?student_id=${studentData.studentId}&assignment_name=${selectedAssignment.name}`)
        .then(response => response.json())
        .then(data => {
          const trends = data.snapshot_trends || {};
          const formattedData = [];
          Object.keys(trends).forEach(codeFile => {
            trends[codeFile].forEach(entry => {
              formattedData.push({
                timestamp: new Date(entry.timestamp),
                size: entry.size,
                codeFile, 
              });
            });
          });
          setGraphData(formattedData);
          console.log("그래프 데이터: ", formattedData);
        })
        .catch(error => {
          console.log(backendUrl);
          console.error('Error fetching graph data:', error);
        });

      fetch(`${backendUrl}/codes?student_id=${studentData.studentId}&assignment_name=${selectedAssignment.name}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setCodeFiles(data.code_files || []);
        })
        .catch(error => {
          console.error('Error fetching code list:', error);
        });
    }
  }, [selectedAssignment, studentData]);

  useEffect(() => {
    if (selectedCodeFile) {
      fetch(`${backendUrl}/snapshots?student_id=${studentData.studentId}&assignment_name=${selectedAssignment.name}&code_file_name=${selectedCodeFile}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setSnapshots(data.snapshots || []);
        })
        .catch(error => {
          console.error('Error fetching snapshots:', error);
        });
    }
  }, [selectedCodeFile, studentData, selectedAssignment]);

  useEffect(() => {
    if (selectedSnapshot) {
      fetch(`${backendUrl}/content?student_id=${studentData.studentId}&assignment_name=${selectedAssignment.name}&code_file_name=${selectedCodeFile}&snapshot_name=${selectedSnapshot}`)
        .then(response => response.json())
        .then(data => {
          setFileContent(data.content || "파일을 불러올 수 없습니다.");
        })
        .catch(error => {
          console.error('Error fetching snapshot content:', error);
        });
    }
  }, [selectedSnapshot, studentData, selectedAssignment, selectedCodeFile]);

  if (loading) {
    console.log("monitoring lodaing");
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!studentData) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>
          데이터를 찾을 수 없습니다.
        </Typography>
      </Container>
    );
  }

  if (!selectedAssignment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" gutterBottom>
              {studentData.name} ({studentData.studentId}) - 과제 목록
            </Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>과제명</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>선택</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData.assignments?.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.name}</TableCell>
                    <TableCell>{assignment.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => setSelectedAssignment(null)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {studentData.name} ({studentData.studentId}) - {selectedAssignment.name} 모니터링 데이터
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* 요약 통계 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  코드 변경
                </Typography>
                <Typography variant="h4">
                  {studentData.totalCodeChanges}회
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  컴파일 시도
                </Typography>
                <Typography variant="h4">
                  {studentData.totalCompiles}회
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 시계열 그래프 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  시간별 코드 변화율
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="timestamp" 
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        tick={{ fontSize: 12 }}
                        // tickFormatter={(timestamp) => timestamp.toLocaleString()}
                        tickFormatter={(timestamp) => {
                          return timestamp.toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
                        }}
                        tickMargin={10}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        scale="log"
                        allowDataOverflow={true}
                        domain={[1, 'dataMax']}
                      />
                      <Tooltip 
                        // formatter={(value, name) => [
                        //   `${name} - ${value}`,
                        // ]}
                        // labelFormatter={(label) => `${label}`}
                        content={({ payload, label }) => {
                          return (
                            <div className="custom-tooltip" style={{ background: "white", padding: "10px", border: "1px solid #ccc" }}>
                              <p className="label">{new Date(label).toLocaleString("ko-KR")}</p>
                              {payload.map((entry, index) => (
                                <p key={index} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}
                                </p>
                              ))}
                            </div>
                          );
                        }}
                      />
                      {/* <Legend 
                        verticalAlign="top" 
                        height={36}
                        formatter={(value) => 
                          value === 'codeChanges' ? '코드 변경' : '컴파일'
                        }
                      />
                      <Line 
                        type="monotone" 
                        dataKey="codeChanges" 
                       name="코드 변경" 
                         stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      /> */}
                      <Legend />
                      {Array.from(new Set(graphData.map((d) => d.codeFile))).map((codeFile, index) => (
                        <Line 
                          key={codeFile}
                          type="monotone"
                          dataKey="size"
                          data={graphData.filter((d) => d.codeFile === codeFile)}
                          name={codeFile}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

       {/* 코드 파일별 스냅샷 목록 */}
       <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                코드 파일 목록
              </Typography>
              <Select
                value={selectedCodeFile}
                onChange={(e) => setSelectedCodeFile(e.target.value)}
                fullWidth
              >
                {codeFiles.map((file) => (
                  <MenuItem key={file} value={file}>
                    {file}
                  </MenuItem>
                ))}
              </Select>
            </CardContent>
          </Card>
        </Grid>

        {/* 스냅샷 목록 */}
        {selectedCodeFile && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedCodeFile}의 스냅샷 목록
                </Typography>
                <Select
                  value={selectedSnapshot}
                  onChange={(e) => setSelectedSnapshot(e.target.value)}
                  fullWidth
                >
                  {snapshots.map((snapshot) => (
                    <MenuItem key={snapshot.timestamp} value={snapshot.timestamp}>
                      {`Timestamp: ${snapshot.timestamp} - Size: ${snapshot.size} bytes`}
                    </MenuItem>
                  ))}
                </Select>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 스냅샷 파일 내용 표시 */}
        {selectedSnapshot && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">스냅샷 파일 내용</Typography>
                <Box sx={{ whiteSpace: "pre-wrap", backgroundColor: "#f4f4f4", p: 2 }}>
                  {fileContent}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Monitoring; 