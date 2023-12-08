import React from 'react';

const Register = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No registered users.</p>;
  }

  return (
    <div>
      <h2>Registered Users</h2>
      {data.map((user, index) => (
        <div key={index}>
          <p>
            <strong>Email:</strong> {user.email}
            {/* Dodajte druge atribute korisnika kako je potrebno */}
          </p>
        </div>
      ))}
    </div>
  );
};

export { Register };
