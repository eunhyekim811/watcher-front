import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Box,
  Button,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import MonitorIcon from '@mui/icons-material/Monitor';
import CodeIcon from '@mui/icons-material/Code';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  mockStudentCodeStats, 
  mockCompileStats, 
  mockSubmissionStats 
} from '../../mockData/monitoringData';
import { useTheme } from '../../contexts/ThemeContext';
import RemainingTime from './RemainingTime';
import WatcherBreadcrumbs from '../common/WatcherBreadcrumbs';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { fetchStatsData } from '../../api/watcher';

const MonitoringDashboard = () => {
  const { isDarkMode } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState('changes');
  
  const { courseCode } = useParams();
  const [hwList, setHwList] = useState([]);
  const [selectedHw, setSelectedHw] = useState('');
  const [statsData, setStatsData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: isDarkMode ? 'rgb(48, 48, 48)' : 'rgb(255, 255, 255)',
          padding: '8px 12px',
          borderRadius: "8px",
          border: "none",
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          color: isDarkMode ? '#fff' : '#000',
          fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif"
        }}>
          <p><strong>Student ID:</strong> {data.student_id}</p>
          <p><strong>Timestamp:</strong> {data.timestamp}</p>
          <p><strong>Code Size:</strong> {data.code_size} bytes</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchHwList = async () => {
      const mockHwList = ["hw1", "hw2"];
      setHwList(mockHwList);

      setSelectedHw(mockHwList[mockHwList.length - 1]);
    };

    fetchHwList();
  }, [courseCode]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await fetchStatsData(courseCode, selectedHw);
      setStatsData(data);

      const formattedData = data.top.map((student, index) => ({
        index, 
        student_id: student.student_id.toString(), 
        code_size: student.code_size,
        timestamp: student.timestamp
      }));

      setChartData(formattedData);
      console.log('chartData', chartData);
    };

    if (courseCode && selectedHw) {
      fetchStats();
    }
  }, [courseCode, selectedHw]);

  return (
    <Card>
      {/* <MetricSelector 
        selectedMetric={selectedMetric} 
        onMetricChange={setSelectedMetric}
      /> */}
      <CardContent sx={{ height: '600px' }}>

        {/* 과제 선택 드롭다운 */}
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>과제 선택</InputLabel>
          <Select value={selectedHw} onChange={(e) => setSelectedHw(e.target.value)}>
            {hwList.map((hw, index) => (
              <MenuItem key={index} value={hw}>
                {hw}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 50, left: 50, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                fill={isDarkMode ? '#1e1e1e' : '#f5f5f5'}
              />
              <XAxis 
                dataKey="student_id"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                stroke={isDarkMode ? '#fff' : '#000'}
              />
              <YAxis 
                label={{ 
                  value: '코드 크기 (bytes)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -40,
                  fill: isDarkMode ? '#fff' : '#000'
                }}
                stroke={isDarkMode ? '#fff' : '#000'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top"
                height={36}
              />
              <Bar 
                dataKey="code_size" 
                fill={isDarkMode ? '#42a5f5' : '#1976d2'}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ClassDetail = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [course, setCourse] = useState(null);
  const [sort, setSort] = useState({
    field: 'email',
    order: 'asc'
  });
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    assignmentName: '',
    assignmentDescription: '',
    kickoffDate: '',
    deadlineDate: ''
  });
  const [currentTab, setCurrentTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'students'; // 기본값은 students
  });
  const [selectedMetric, setSelectedMetric] = useState('changes');

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    // URL 업데이트
    const params = new URLSearchParams(location.search);
    params.set('tab', newValue);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const coursesResponse = await api.get('/api/users/me/courses/details');
        // const foundCourse = coursesResponse.data.find(c => c.courseCode === courseCode);
        
        // if (!foundCourse) {
        //   throw new Error('강의를 찾을 수 없습니다.');
        // }

        const foundCourse = {
          courseCode: courseCode,
          courseId: '1',
          courseName: '운영체제',
          assignments: [
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
        };

        setCourse(foundCourse);
        setAssignments(foundCourse.assignments || []);
        
        // const studentsResponse = await api.get(`/api/courses/${foundCourse.courseId}/users`);
        const studentsResponse = {
          data: [
            {
              userId: '1',
              email: 'testA@jbnu.ac.kr',
              name: '학생A',
              studentNum: '202212112'
            },
            {
              userId: '2',
              email: 'testB@jbnu.ac.kr',
              name: '학생B',
              studentNum: '202012180'
            }
          ]
        };

        setStudents(studentsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };
    fetchData();
  }, [courseCode]);

  const getFilteredAndSortedStudents = () => {
    const filtered = students.filter(student => {
      const searchLower = searchQuery.toLowerCase();
      const emailMatch = student.email?.toLowerCase().includes(searchLower);
      const nameMatch = student.name?.toLowerCase().includes(searchLower);
      const studentNumMatch = String(student.studentNum || '').toLowerCase().includes(searchLower);
      return emailMatch || nameMatch || studentNumMatch;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      switch(sort.field) {
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'studentNum':
          aValue = String(a.studentNum || '');
          bValue = String(b.studentNum || '');
          break;
        default:
          aValue = '';
          bValue = '';
      }
      
      return sort.order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const toggleSort = (field) => {
    setSort(prev => ({
      field: field,
      order: prev.field === field ? (prev.order === 'asc' ? 'desc' : 'asc') : 'asc'
    }));
  };

  const handleAddAssignment = async () => {
    try {
      await api.post(`/api/courses/${course.courseId}/assignments`, {
        ...newAssignment,
        kickoffDate: new Date(newAssignment.kickoffDate).toISOString(),
        deadlineDate: new Date(newAssignment.deadlineDate).toISOString()
      });

      // 과제 목록 새로고침
      const assignmentsResponse = await api.get(`/api/courses/${course.courseId}/assignments`);
      setAssignments(assignmentsResponse.data);

      setOpenAssignmentDialog(false);
      setNewAssignment({
        assignmentName: '',
        assignmentDescription: '',
        kickoffDate: '',
        deadlineDate: ''
      });
    } catch (error) {
      console.error('과제 추가 실패:', error);
      // TODO: 에러 처리
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography 
            color="error" 
            align="center"
            sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}
          >
            {error}
          </Typography>
        </Paper>
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
          <WatcherBreadcrumbs 
            paths={[
              { 
                text: course?.courseName || '로딩중...', 
                to: `/watcher/class/${courseCode}` 
              }
            ]} 
          />
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: 2,
            mb: 4 
          }}>
            {/* 강의 정보 */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center',
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif"
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                  color: 'text.primary'
                }}
              >
                {course?.courseName}
              </Typography>
              <Box 
                component="span" 
                sx={{ 
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                }}
              >
                {course?.courseCode}
              </Box>
              <Box 
                component="span"
                sx={{ 
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: (theme) => theme.palette.action.hover
                }}
              >
                {course?.courseClss}분반
              </Box>
            </Box>
          </Box>

          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              mb: 3,
              minHeight: '40px',
              '& .MuiTab-root': {
                minHeight: '40px',
                padding: '6px 16px',
                fontSize: '0.875rem'
              }
            }}
          >
            <Tab 
              icon={<GroupIcon sx={{ fontSize: '1.2rem', mr: 1 }} />} 
              label="수강생 관리" 
              value="students"
              iconPosition="start"
              sx={{ 
                fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                textTransform: 'none',
                minHeight: '40px',
                alignItems: 'center'
              }}
            />
            <Tab 
              icon={<AssignmentIcon sx={{ fontSize: '1.2rem', mr: 1 }} />} 
              label="과제 관리" 
              value="assignments"
              iconPosition="start"
              sx={{ 
                fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                textTransform: 'none',
                minHeight: '40px',
                alignItems: 'center'
              }}
            />
            <Tab 
              icon={<TimelineIcon sx={{ fontSize: '1.2rem', mr: 1 }} />} 
              label="통계" 
              value="statistics"
              iconPosition="start"
              sx={{ 
                fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                textTransform: 'none',
                minHeight: '40px',
                alignItems: 'center'
              }}
            />
          </Tabs>

          {/* 학생 목록 탭 */}
          {currentTab === 'students' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        이메일
                        <IconButton size="small" onClick={() => toggleSort('email')} sx={{ ml: 1 }}>
                          <Box sx={{ 
                            transform: sort.field !== 'email' ? 'rotate(0deg)' : (sort.order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'),
                            transition: 'transform 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <KeyboardArrowDownIcon fontSize="small" />
                          </Box>
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        이름
                        <IconButton size="small" onClick={() => toggleSort('name')} sx={{ ml: 1 }}>
                          <Box sx={{ 
                            transform: sort.field !== 'name' ? 'rotate(0deg)' : (sort.order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'),
                            transition: 'transform 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <KeyboardArrowDownIcon fontSize="small" />
                          </Box>
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        학번
                        <IconButton size="small" onClick={() => toggleSort('studentNum')} sx={{ ml: 1 }}>
                          <Box sx={{ 
                            transform: sort.field !== 'studentNum' ? 'rotate(0deg)' : (sort.order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'),
                            transition: 'transform 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <KeyboardArrowDownIcon fontSize="small" />
                          </Box>
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        작업
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredAndSortedStudents().map((student, index) => (
                      <TableRow 
                        key={student.email}
                        sx={{ 
                          transition: 'all 0.3s ease',
                          animation: 'fadeIn 0.3s ease',
                          '@keyframes fadeIn': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(10px)'
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                      >
                        <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                          {student.email}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                          {student.name}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                          {student.studentNum}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CodeIcon sx={{ fontSize: '1rem' }} />}
                              onClick={async () => {
                                try {
                                  const response = await api.get(`/api/redirect/redirect`, {
                                    params: {
                                      userId: student.userId,
                                      courseId: course.courseId
                                    }
                                  });
                                  window.location.href = response.data.redirectUrl;
                                } catch (error) {
                                  console.error('JCode 리다이렉트 실패:', error);
                                }
                              }}
                              sx={{ 
                                fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1.5,
                                minHeight: '28px',
                                borderRadius: '14px',
                                textTransform: 'none'
                              }}
                            >
                              JCode
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<MonitorIcon sx={{ fontSize: '1rem' }} />}
                              onClick={() => navigate(`/watcher/class/${courseCode}/monitoring/${student.userId}`)}
                              sx={{ 
                                fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                                fontSize: '0.75rem',
                                py: 0.5,
                                px: 1.5,
                                minHeight: '28px',
                                borderRadius: '14px',
                                textTransform: 'none',
                                '&:hover': {
                                  backgroundColor: (theme) => 
                                    theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(33, 150, 243, 0.08)'
                                }
                              }}
                            >
                              Watcher
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {getFilteredAndSortedStudents().length === 0 && (
                <Typography 
                  sx={{ 
                    mt: 2, 
                    textAlign: 'center',
                    fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif"
                  }}
                >
                  {searchQuery ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
                </Typography>
              )}
            </Box>
          )}

          {/* 과제 관리 탭 */}
          {currentTab === 'assignments' && (
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        과제명
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        설명
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        시작일
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold' }}>
                        마감일
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif", fontWeight: 'bold', width: '250px' }}>
                        남은 시간
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow 
                        key={assignment.assignmentId}
                        onClick={() => navigate(`/watcher/class/${courseCode}/assignment/${assignment.assignmentId}`)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: (theme) => 
                              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                          },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                          {assignment.assignmentName}
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {assignment.assignmentDescription}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                          {new Date(assignment.kickoffDate).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                          {new Date(assignment.deadlineDate).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell sx={{ 
                          width: '250px',
                          textAlign: 'left'
                        }}>
                          <RemainingTime deadline={assignment.deadlineDate} />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      onClick={() => setOpenAssignmentDialog(true)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: (theme) => 
                            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        },
                        transition: 'all 0.2s ease',
                        height: '60px'
                      }}
                    >
                      <TableCell 
                        colSpan={5}
                        align="center"
                        sx={{ 
                          border: (theme) => `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                          borderRadius: 1,
                          m: 1,
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 1,
                            color: 'text.secondary'
                          }}
                        >
                          <AddIcon />
                          <Typography sx={{ fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif" }}>
                            새 과제 추가
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* 통계 탭 */}
          {currentTab === 'statistics' && (
            <Box>
              {/* <Typography>통계 데이터가 준비중입니다.</Typography> */}
              <MonitoringDashboard />
            </Box>
          )}

          <Dialog 
            open={openAssignmentDialog} 
            onClose={() => setOpenAssignmentDialog(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                minHeight: '500px'
              }
            }}
          >
            <DialogTitle 
              sx={{ 
                fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                fontSize: '1.5rem',
                py: 3
              }}
            >
              새 과제 추가
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="과제명"
                    value={newAssignment.assignmentName}
                    onChange={(e) => setNewAssignment({ 
                      ...newAssignment, 
                      assignmentName: e.target.value 
                    })}
                    placeholder="ex) 1주차 과제: Hello World"
                    sx={{ 
                      '& .MuiInputBase-root': {
                        height: '56px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="과제 설명"
                    value={newAssignment.assignmentDescription}
                    onChange={(e) => setNewAssignment({ 
                      ...newAssignment, 
                      assignmentDescription: e.target.value 
                    })}
                    multiline
                    rows={6}
                    placeholder="과제에 대한 설명을 입력하세요"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="시작 일시"
                    type="datetime-local"
                    value={newAssignment.kickoffDate}
                    onChange={(e) => setNewAssignment({ 
                      ...newAssignment, 
                      kickoffDate: e.target.value 
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 60,
                      style: {
                        height: '24px',
                        padding: '12px'
                      }
                    }}
                    sx={{ 
                      '& .MuiInputBase-root': {
                        height: '56px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="마감 일시"
                    type="datetime-local"
                    value={newAssignment.deadlineDate}
                    onChange={(e) => setNewAssignment({ 
                      ...newAssignment, 
                      deadlineDate: e.target.value 
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 60,
                      style: {
                        height: '24px',
                        padding: '12px'
                      }
                    }}
                    sx={{ 
                      '& .MuiInputBase-root': {
                        height: '56px'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setOpenAssignmentDialog(false)}
                variant="outlined"
                size="small"
                sx={{ 
                  fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  minHeight: '28px',
                  borderRadius: '14px',
                  textTransform: 'none'
                }}
              >
                취소
              </Button>
              <Button 
                onClick={handleAddAssignment} 
                variant="contained"
                size="small"
                sx={{ 
                  fontFamily: "'JetBrains Mono', 'Noto Sans KR', sans-serif",
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  minHeight: '28px',
                  borderRadius: '14px',
                  textTransform: 'none'
                }}
              >
                추가
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Fade>
  );
};

export default ClassDetail; 