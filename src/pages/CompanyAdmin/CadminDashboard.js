import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';

const ProductionDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/charts/all-data`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  const getTodayProduction = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayData = data.filter(item => item.Date === today);

    return ['CTM-P', 'CTM-D', 'CTM-M'].map(plant => ({
      plant,
      goodPcs: todayData
        .filter(item => item.Plant === plant)
        .reduce((sum, item) => sum + (parseInt(item.Good_Pcs) || 0), 0),
     
    }));
  };

  const getStyleDistribution = () => {
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-based)
    const currentYear = new Date().getFullYear(); // Get current year
  
    const styleGroups = data.reduce((acc, item) => {
      if (item.Style && item.Good_Pcs && item.Month === currentMonth && item.Year === currentYear) {
        acc[item.Style] = (acc[item.Style] || 0) + (parseInt(item.Good_Pcs) || 0);
      }
      return acc;
    }, {});
  
    return Object.entries(styleGroups)
      .map(([style, value]) => ({
        name: style,
        value
      }))
      .sort((a, b) => b.value - a.value);
  };
  

  const getDailyData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get current month (1-based)
    const currentYear = currentDate.getFullYear(); // Get current year
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Get number of days in the month
  
    // Initialize an object with all days set to 0
    const dailyGroups = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyGroups[date] = {
        date,
        totalGoodPcs: 0 // Add total company good pcs field
      };
    }
  
    // Populate with actual data
    data.forEach((item) => {
      if (item.Month === currentMonth && item.Year === currentYear) {
        const date = item.Date;
        if (dailyGroups[date]) {
          dailyGroups[date].totalGoodPcs += parseInt(item.Good_Pcs) || 0; // Sum up all plants
        }
      }
    });
  
    return Object.values(dailyGroups).sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  

  const getDailyDataForPlant = (plant) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get current month (1-based)
    const currentYear = currentDate.getFullYear(); // Get current year
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Get total days in month
  
    // Initialize an object with all days set to 0
    const dailyGroups = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyGroups[date] = {
        date,
        goodPcs: 0 // Specific to selected plant
      };
    }
  
    // Populate with actual data for the selected plant
    data.forEach((item) => {
      if (item.Month === currentMonth && item.Year === currentYear && item.Plant === plant) {
        const date = item.Date;
        if (dailyGroups[date]) {
          dailyGroups[date].goodPcs += parseInt(item.Good_Pcs) || 0;
        }
      }
    });
  
    return Object.values(dailyGroups).sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  const getDamageAndShortageData = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Get current month (1-based)
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Get total days in month

    // Initialize dataset with zero values for all days in the current month
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
        const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
        return {
            date,
            Damage_Pcs: 0,
            Cut_Panel_Shortage: 0,
        };
    });

    // Convert array to object for fast lookup
    const dailyMap = dailyData.reduce((acc, obj) => {
        acc[obj.date] = obj;
        return acc;
    }, {});

    // Update with actual data
    data.forEach(item => {
        const itemDate = item.Date;
        if (item.Year === currentYear && item.Month === currentMonth) { // Ensure current month/year match
            if (dailyMap[itemDate]) {
                dailyMap[itemDate].Damage_Pcs += parseInt(item.Damage_Pcs) || 0;
                dailyMap[itemDate].Cut_Panel_Shortage += parseInt(item.Cut_Panel_Shortage) || 0;
            }
        }
    });

    return Object.values(dailyMap);
};



const getMonthlyProductionData = () => {
  const currentDate = new Date();
  const monthlyGroups = {};

  // Initialize last 12 months with zero values
  for (let i = 11; i >= 0; i--) {
    let pastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    let key = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}`;
    monthlyGroups[key] = { 
      month: pastDate.toLocaleString('default', { month: 'short', year: 'numeric' }), // Example: "Feb 2024"
      goodPcs: 0 
    };
  }

  // Aggregate Good_Pcs for each month
  data.forEach((item) => {
    let key = `${item.Year}-${String(item.Month).padStart(2, '0')}`;
    if (monthlyGroups[key]) {
      monthlyGroups[key].goodPcs += parseInt(item.Good_Pcs) || 0;
    }
  });

  return Object.values(monthlyGroups);
};


const containerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    paddingBottom: '50px'
  };

  const cardStyle = {
    backgroundColor: '#fffed9 ',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    border: 'none',
    marginBottom: '25px'
  };

  const chartContainerStyle = {
    height: '400px',
    margin: '10px 0'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>              
            </div>            
          </div>         
        </div>
      </div>
    );
  }
  

  const todayData = getTodayProduction();
  const styleData = getStyleDistribution();
  const dailyData = getDailyData();
  const chartData = getDamageAndShortageData();


  return (
    <div style={containerStyle}>
     
      <Container fluid className='p-3'>
        
        

        {/* Daily Production Details */}
        <Row >
          <Col md={6}>
            <Card style={cardStyle}>
              <Card.Header className="bg-transparent border-bottom-0">
                <h5 className="mb-0 text-center">Today Production Details ({new Date().toISOString().split('T')[0]})</h5>
              </Card.Header>
              <Card.Body>
                <div style={chartContainerStyle} className="justify-content-center">
                <ResponsiveContainer width="80%" height="100%" >
                  <BarChart data={todayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="plant" />
                    <YAxis />
                    <Tooltip  contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}/>
                    <Legend />
                    <Bar
                        dataKey="goodPcs"                
                        fill="#4cc200"
                        name="Good Pieces"
                        radius={[4, 4, 0, 0]}
                      />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card style={cardStyle}>
              <Card.Header className="bg-transparent border-bottom-0">
                <h5 className="mb-0 text-center">This Month Style Distribution ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</h5>
              </Card.Header>
              <Card.Body>
              <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={styleData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {styleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                     contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

         {/* Daily Good Pieces - All Plants */}
         <Row>
          <Col md={12}>
            <Card style={cardStyle}>
              <Card.Header className="bg-transparent border-bottom-0">
                <h5 className="mb-0 text-center">This Month Overall Good Pieces ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</h5>
              </Card.Header>
              <Card.Body>
                <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip  contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}/>
                    <Legend />
                    <Line type="monotone" dataKey="totalGoodPcs" stroke="#5d00ff" dot={true} name="Total Good Pieces" strokeWidth={3}/>

                  </LineChart>
                </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>


        {/* Daily Production Details - Individual Plants */}
        {["CTM-P", "CTM-D", "CTM-M"].map((plant) => {
  const plantData = getDailyDataForPlant(plant);

  return (
    <Row>
          <Col md={12}>
            <Card style={cardStyle}>
              <Card.Header className="bg-transparent border-bottom-0">
                <h5 className="mb-0 text-center">This Month Good Pieces - {plant} ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</h5>
              </Card.Header>
              <Card.Body>
                <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height="100%">
              <LineChart data={plantData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip  contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}/>
                <Legend />
                <Line type="monotone" dataKey="goodPcs" stroke="#d800ff" dot={true} name="Good Pieces" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
  );
})}
        


        {/* Damage and Shortage Chart */}
        <Row>
          <Col md={12}>
            <Card style={cardStyle}>
              <Card.Header className="bg-transparent border-bottom-0">
                <h5 className="mb-0 text-center">This Month Overall Damage Pieces and Cut Panel Shortage ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</h5>
              </Card.Header>
              <Card.Body>
                <div style={chartContainerStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee"  />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        tick={{fill: '#666'}}
                      />
                      <YAxis tick={{fill: '#666'}} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone"
                        dataKey="Damage_Pcs"
                        stroke="#FF0000"
                        strokeWidth={3}
                        name="Damage Pieces"
                        dot={true}
                      />
                      <Line
                        type="monotone"
                        dataKey="Cut_Panel_Shortage"
                        stroke="#FFA500"
                        strokeWidth={3}
                        name="Cut Panel Shortage"
                        dot={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Monthly Production Overview */}
        <Row>
          <Col md={12}>
            <Card style={cardStyle}>
              <Card.Header className="bg-transparent border-bottom-0">
                <h5 className="mb-0 text-center">Monthly Production Overview - Good Pieces</h5>
              </Card.Header>
              <Card.Body>
                <div style={chartContainerStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMonthlyProductionData()}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis
                        dataKey="month"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        tick={{fill: '#666'}}
                      />
                      <YAxis tick={{fill: '#666'}} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="goodPcs"
                        fill="#0088FE"
                        name="Good Pieces"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductionDashboard;