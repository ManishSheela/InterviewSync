import React from 'react'
import Avatar from "react-avatar";
const Client = ({ username }) => {
    console.log(username);
  return (
    <div className="client">
          <Avatar name={username} size="70" round="10px" />
          <span className='username gradientText' > {username} </span>
    </div>
  );
}

export default Client