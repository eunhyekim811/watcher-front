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
  Chip,
  Fade,
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { mockMonitoringData } from '../../mockData/classes';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { fetchMonitoringData, fetchGraphData, fetchHwFiles, fetchSnapshots, fetchSnapshotAvg } from '../../api/watcher';
import { DataObjectTwoTone } from '@mui/icons-material';


const assignments = [
  {
    assignmentId: '1',
    assignmentName: 'hw1',
    assignmentDescription: '첫 번째 과제 설명',
    kickoffDate: '2025-03-01T10:00:00',
    deadlineDate: '2025-03-10T23:59:59'
  },
  {
    assignmentId: '2',
    assignmentName: 'hw2',
    assignmentDescription: '두 번째 과제 설명',
    kickoffDate: '2025-04-01T10:00:00',
    deadlineDate: '2025-04-10T23:59:59'
  },
]

const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff0000", "#00bfff", "#9932cc"];

const MonitoringData = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { courseCode, studentId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [studentNum, setStudentNum] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [snapshotAvg, setSnapshotAvg] = useState({});
  const [hwSnapshotAvg, setHwSnapshotAvg] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [hwFiles, setHwFiles] = useState([]);
  const [selectedHwFile, setSelectedHwFile] = useState('');
  const [snapshotList, setSnapshotList] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState('');


  useEffect(() => {
    // console.log(courseCode, studentId);
    setStudentNum(mockMonitoringData[studentId].studentId);
    // console.log(studentNum);

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
          setSelectedAssignment(assignments[assignments.length - 1].assignmentName);
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

    const loadData = async () => {
      try {
      if (studentNum) {
        setLoading(true);

        const avgData = await fetchMonitoringData(courseCode, selectedAssignment, studentNum);
        setSnapshotAvg(avgData);

        const hwList = await fetchHwFiles(courseCode, selectedAssignment, studentNum);
        setHwFiles(hwList);

        const data = await fetchGraphData(courseCode, selectedAssignment, studentNum);
      
        const trends = data.snapshot_trends || {};
        const formattedData = {};

        Object.keys(trends).forEach((file) => {
          trends[file].forEach((entry) => {
            const {timestamp, size} = entry;

            if(!formattedData[timestamp]) {
              formattedData[timestamp] = { timestamp };
            }
            formattedData[timestamp][file] = size;
          });
        });

        setGraphData(Object.values(formattedData));

      }

      } catch (err) {
        setError(err.message || "데이터 로딩 실패");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedAssignment, courseCode, studentNum]);

  useEffect(() => {
    const loadSnapshots = async () => {
      try {
        if (selectedHwFile) {
          setLoading(true);

          const snapshots = await fetchSnapshots(courseCode, selectedAssignment, studentNum, selectedHwFile);
          setSnapshotList(snapshots || []);

          const data = await fetchSnapshotAvg(courseCode, selectedAssignment, studentNum, selectedHwFile);
          setHwSnapshotAvg(data);
        }
      } catch (err) {
        setError(err.message || "스냅샷 로딩 실패");
      } finally {
        setLoading(false);
      }
    };

    loadSnapshots();
  }, [selectedAssignment, courseCode, studentNum, studentId, selectedHwFile]);

  const handleAssignmentChange = (event) => {
    // assignments[assignments.length - 1].assignmentName
    setSelectedAssignment(event.target.value);
    setSelectedHwFile('');
    setSelectedSnapshot('');
  };

  if (loading) {
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

  return (
    <Fade in={true} timeout={300}>
      <Container 
        maxWidth={false}
        sx={{ 
          mt: 2,
          px: 2,
        }}
      >
        <Paper 
          elevation={1}
          sx={{ 
            p: 2,
            minHeight: 'calc(100vh - 100px)',
            borderRadius: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => navigate(-1)} 
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.action.hover
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography 
                variant="h5"
                sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
              >
                {studentData.name} ({studentData.studentId}) - 모니터링 데이터
              </Typography>
            </Box>
            <Select
              value={selectedAssignment}
              onChange={handleAssignmentChange}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              {assignments.map((assignment) => (
                <MenuItem key={assignment.assignmentId} value={assignment.assignmentName}>
                  {assignment.assignmentName}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Grid container spacing={3}>  
            {/* 코드 파일별 스냅샷 목록 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    코드 파일 목록
                  </Typography>
                  <Select
                    value={selectedHwFile}
                    onChange={(e) => setSelectedHwFile(e.target.value)}
                    fullWidth
                  >
                    {hwFiles.map((file) => (
                      <MenuItem key={file} value={file}>
                        {file}
                      </MenuItem>
                    ))}
                  </Select>
                </CardContent>
              </Card>
            </Grid>

            {/* 스냅샷 목록 */}
            <Grid item xs={12} md={6} sx={{ visibility: selectedHwFile ? 'visible' : 'hidden' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedHwFile}의 스냅샷 목록
                  </Typography>
                  <Select
                    value={selectedSnapshot}
                    onChange={(e) => setSelectedSnapshot(e.target.value)}
                    fullWidth
                  >
                    {snapshotList.map((snapshot, index) => (
                      <MenuItem key={index} value={snapshot}>
                        {`Timestamp: ${snapshot}`}
                      </MenuItem>
                    ))}
                  </Select>
                </CardContent>
              </Card>
            </Grid>

            {/* 요약 통계 */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
                  >
                    코드 변경
                  </Typography>
                  <Typography variant="h4">
                    {snapshotAvg.snapshot_avg}회
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
                  >
                    평균 코드 사이즈
                  </Typography>
                  <Typography variant="h4">
                    {snapshotAvg.snapshot_size_avg} bytes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* <Grid item xs={12} md={3} sx={{ visibility: selectedHwFile ? 'visible' : 'hidden' }}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
                  >
                    {selectedHwFile}의 코드 변화
                  </Typography>
                  <Typography variant="h4">
                    {hwSnapshotAvg.snapshot_avg}회
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}

            <Grid item xs={12} md={4} sx={{ visibility: selectedHwFile ? 'visible' : 'hidden' }}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
                  >
                    {selectedHwFile}의 평균 크기
                  </Typography>
                  <Typography variant="h4">
                    {hwSnapshotAvg.snapshot_size_avg} bytes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 시계열 그래프 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
                  >
                    시간별 코드 변화율
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="timestamp" 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                        />
                        <Tooltip 
                          formatter={(value, name) => [ `${value} bytes`, name]}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          formatter={(value) => value}
                        />
                        {graphData.length > 0 &&
                          Array.from(new Set(graphData.flatMap((entry) =>
                            Object.keys(entry).filter((key) => key !== "timestamp")
                          ))).map((file, index) => (
                          <Line 
                            key={file}
                            type="monotone" 
                            dataKey={file}
                            // data={graphData.filter((d) => d.codeFile === codeFile)}
                            name={file} 
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{ strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Fade>
  );
};

export default MonitoringData; 