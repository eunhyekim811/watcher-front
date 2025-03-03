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
  MenuItem,
  Stack
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
    setSelectedAssignment(event.target.value);
    setSelectedHwFile('');
    setSelectedSnapshot('');
  };

  const handleHwFileChange = (event) => {
    const value = event.target.value;
    setSelectedHwFile(value);
    setSelectedSnapshot('');  // 파일이 변경되면 스냅샷 선택 초기화
  };

  const handleSnapshotChange = (event) => {
    setSelectedSnapshot(event.target.value);
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
          elevation={0}
          sx={{ 
            p: 3,
            minHeight: 'calc(100vh - 100px)',
            borderRadius: 2,
            bgcolor: '#fafafa'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
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
                sx={{ 
                  fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                  fontWeight: 500
                }}
              >
                {studentData.name} ({studentData.studentId})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                과제 선택
              </Typography>
              <Select
                value={selectedAssignment}
                onChange={handleAssignmentChange}
                displayEmpty
                size="small"
                sx={{ 
                  minWidth: 120,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                {assignments.map((assignment) => (
                  <MenuItem key={assignment.assignmentId} value={assignment.assignmentName}>
                    {assignment.assignmentName}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* 주요 통계 데이터 */}
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>주요 통계</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        코드 변경
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {snapshotAvg.snapshot_avg}
                        <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>회</Typography>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        평균 코드 사이즈
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {snapshotAvg.snapshot_size_avg}
                        <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>B</Typography>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        총 작업 시간
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {(() => {
                          const total = snapshotAvg.total;
                          const days = Math.floor(total / (24 * 3600));
                          const hours = Math.floor((total % (24 * 3600)) / 3600);
                          const minutes = Math.floor((total % 3600) / 60);
                          const seconds = total % 60;
                          
                          const parts = [];
                          if (days > 0) parts.push(`${days}일`);
                          if (hours > 0) parts.push(`${hours}시간`);
                          if (minutes > 0) parts.push(`${minutes}분`);
                          if (seconds > 0 || parts.length === 0) parts.push(`${seconds}초`);
                          
                          return parts.join(' ');
                        })()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* 시계열 그래프 */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>시간별 코드 변화</Typography>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                        <XAxis 
                          dataKey="timestamp" 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          stroke="rgba(0,0,0,0.1)"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickMargin={10}
                          stroke="rgba(0,0,0,0.1)"
                        />
                        <Tooltip 
                          formatter={(value, name) => [ `${value} bytes`, name]}
                          labelFormatter={(label) => `${label}`}
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
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
                            name={file} 
                            stroke={colors[index % colors.length]}
                            strokeWidth={1.5}
                            dot={{ strokeWidth: 1.5, r: 3 }}
                            activeDot={{ r: 5, strokeWidth: 1.5 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* 작업 시간 통계 및 파일 선택 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>작업 시간 세부 정보</Typography>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        첫 작업 시간
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {snapshotAvg.first}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        마지막 작업 시간
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {snapshotAvg.last}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        마지막 작업 간격
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {snapshotAvg.interval} 초
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1 }}>
                        평균 작업 간격
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {Math.round(snapshotAvg.total / snapshotAvg.snapshot_avg)} 초
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              {/* 파일 선택 */}
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>파일 분석</Typography>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1, mb: 1, display: 'block' }}>
                        코드 파일 선택
                      </Typography>
                      <Select
                        value={selectedHwFile}
                        onChange={handleHwFileChange}
                        fullWidth
                        size="small"
                        displayEmpty
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.1)'
                          }
                        }}
                      >
                        <MenuItem value="">
                          <Typography color="text.secondary">전체</Typography>
                        </MenuItem>
                        {hwFiles.map((file) => (
                          <MenuItem key={file} value={file}>
                            {file.replace(/@/g, '/')}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    {selectedHwFile && (
                      <Box>
                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1, mb: 1, display: 'block' }}>
                          스냅샷 선택
                        </Typography>
                        <Select
                          value={selectedSnapshot}
                          onChange={handleSnapshotChange}
                          fullWidth
                          size="small"
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.1)'
                            }
                          }}
                        >
                          <MenuItem value="">
                            <Typography color="text.secondary">전체</Typography>
                          </MenuItem>
                          {snapshotList.map((snapshot, index) => (
                            <MenuItem key={index} value={snapshot}>
                              {`Timestamp: ${snapshot}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Fade>
  );
};

export default MonitoringData; 