import React from "react";
import { Container } from "react-bootstrap";

function MainAdminPage() {
  return (
    <div 
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh', 
      paddingTop: '50px'  
    }}
  >
      
      <Container className="mt-4">
        <h2 class="text-white"  >Admin Dashboard</h2>
        {/* Add admin-specific content here */}
      </Container>
    </div>
  );
}

export default MainAdminPage;