import React from "react";
import { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from 'axios';
import { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import Modal from "@mui/material/Modal";

export default function BasicTable() {
  const [franchise, setFranchise] = useState([]);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  useEffect(() => {
    fetchFranchises();
  }, [franchise]);

  const fetchFranchises = () => {
    axios.get(`https://dollar-wala-server.vercel.app/api/franchise`)
    .then(response => {
      setFranchise(response.data); 
    })
    .catch(error => {
      console.log(error)
    });
  }

  const sendEmail = (email,action,franchiseId) => {
   console.log(email)
   console.log(action)
    axios.post('https://dollar-wala-server.vercel.app/api/franchise/sendemail', { email, action, franchiseId })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });

      fetchFranchises();

    setAcceptModalOpen(false);
    setRejectModalOpen(false);
  };


  const columns = [

    {
      name: "_id",
      label: "Id",
      options: {
        display: false,
      },
    },
    {
      name: "rowNumber",
      label: "Request",
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
      name: "phoneNumber",
      label: "Contact",
      
    },
    {
      name: "preferredLocation",
      label: "Location",
      options: {
          filter: true,
          sort: true,
        },
    },
    {
      name: "status",
      label: "Status",
      
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
    {
      name:"respond",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const status = tableMeta.rowData[6];
          const email = tableMeta.rowData[3];
          const franchiseId = tableMeta.rowData[0];

          return (
            <div style={{ display: "flex", alignItems: "center" }}>

              {status === "Pending" && (
                <>
                  <DoneIcon
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => setAcceptModalOpen(true)}
                  />
                  <DoNotDisturbIcon
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => setRejectModalOpen(true)}
                  />
                  <Modal open={acceptModalOpen}>
                    <div className="modal">
                      <div className="modal-content">
                        <p>Do you want to send mail to user to call on the customer service number for further details?</p>
                        <div className="modal-actions">
                          <button className="yes" onClick={() => sendEmail(email,"accept",franchiseId)}>Send Email</button>
                          <button className="no" onClick={() => setAcceptModalOpen(false)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <Modal open={rejectModalOpen}>
                    <div className="modal">
                      <div className="modal-content">
                        <p>Do you want to send mail to user that their request cannot be processed further?</p>
                        <div className="modal-actions">
                          <button className="yes" onClick={() => sendEmail(email,"reject",franchiseId)}>Send Email</button>
                          <button className="no" onClick={() => setRejectModalOpen(false)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </>
              )}
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    filterType: "textField", 
    selectableRows: 'none',
    responsive: "standard",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
  };

  return (
    <div>
      <MUIDataTable 
        title="Franchise Requests"
        data={franchise}
        columns={columns}
        options={options}
      />
    </div>
  );

}
