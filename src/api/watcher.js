import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_WATCHER_BACKEND_URL;

export const fetchHwFiles = async (classDiv, hwName, studentId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/${classDiv}/${hwName}/${studentId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching hw files:', error);
        throw error;
    }
};

export const fetchSnapshots = async (classDiv, hwName, studentId, filename) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/${classDiv}/${hwName}/${studentId}/${filename}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching snapshots:', error);
        throw error;
    }
};

export const fetchMonitoringData = async (classDiv, hwName, studentId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/assignments/snapshot_avg/${classDiv}/${hwName}/${studentId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching snapshot average:', error);
        throw error;
    }
};

export const fetchSnapshotAvg = async (classDiv, hwName, studentId, filename) => {
    try { 
        const response = await axios.get(
            `${API_BASE_URL}/api/snapshot_avg/${classDiv}/${hwName}/${studentId}/${filename}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching snapshot average:', error);
        throw error;
    }
};

export const fetchGraphData = async (classDiv, hwName, studentId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/graph_data/${classDiv}/${hwName}/${studentId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching graph data:', error);
        throw error;
    }
};

export const fetchStatsData = async (classDiv, hwName) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/assignment/${classDiv}/${hwName}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching stats data:', error);
        throw error;
    }
};
