import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import axios from 'axios';
export default function BasicTable() {
  const [contact, setContact] = useState([]);

useEffect(() => {
  axios.get(`http://localhost:5000/api/Contact/`)
    .then(response => {
      setContact(response.data); 
    })
    .catch(error => {
      window.alert(error)
    });
}, []);

const columns = [
  {
    name: "rowNumber",
    label: "Query",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => (
        <span>{tableMeta.rowIndex + 1}</span>
      ),
    },
  },
  {
    name: "name",
    label: "Name",

  },
  {
    name: "email",
    label: "User Email",

  },
  
  {
    name: "subject",
    label: "Subject",
    
  },
  {
    name: "message",
    label: "Message",
   
  },
  {
    name: "createdAt",
    label: "Date",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => {
        const date = new Date(value);
  
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  
        return formattedDate;
      },
    },
  },  
];

const options = {
  filter: true,
  filterType: "textField", 
  responsive: "standard",
  selectableRows: 'none',
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 25, 50],
};

return (
  <div>
    <MUIDataTable 
      title="Queries by customers"
      data={contact}
      columns={columns}
      options={options}
    />
  </div>
);

}
