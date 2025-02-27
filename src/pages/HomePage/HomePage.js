import React from "react";
import { Container } from "react-bootstrap";
import TableDisplay from "../../components/TableDisplay/TableDisplay";

function HomePage() {
  return (
    <div 
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh', 
      padding: '20px 0'
    }}
  >
      <Container className="mt-4">
          <TableDisplay />
      </Container>
    </div>
  );
}

export default HomePage;