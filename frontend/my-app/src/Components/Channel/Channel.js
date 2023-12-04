import React from 'react';

export const Channel = ({data}) => {
  // Provera da li data postoji pre pristupa svojstvima
  if (!data) {
    return <div>Data is undefined</div>;
  }

  return (
    <div>
      {/* Provera da li svojstva postoje pre pristupa njihovim vrednostima */}
      <h1>{data.channel ? data.channel : "Channel is undefined"}</h1>
      <h1>{data.tutorial ? data.tutorial : "Tutorial is undefined"}</h1>
    </div>
  );
};
