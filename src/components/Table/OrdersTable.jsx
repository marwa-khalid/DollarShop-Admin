import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import axios from 'axios';
import Modal from "@mui/material/Modal";
import './Modal.css';
import EditIcon from "@mui/icons-material/Edit";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [orders]);

  const fetchOrders = () =>{
    axios.get(`http://localhost:5000/api/orders/all`)
      .then(response => {
        setOrders(response.data); 
      })
      .catch(error => {
        window.alert(error);
      });
    }

    const makeStyle = (status) => {
      if (status === "received") {
        return {
          color: "green",
        };
      } else if (status === "cancelled") {
        return {
          color: "red",
        };
      } else if (status === "processing") {
        return {
          color: "orange",
        };
      } else if (status === "dispatched") {
        return {
          color: "blue", 
        };
      } else {
        return {
          color: 'black',
        };
      }
    };

  const handleDispatchOrder = () => {
    const status = "dispatched";
    const productId = selectedOrder._id;
    console.log(productId)
    axios.put(`http://localhost:5000/api/orders/${productId}`, { status }, {
      headers: {
        'Content-Type': 'application/json', 
      },
    })
    .then((response)=>{
        fetchOrders();
       window.alert("updated")
    }).catch((error) =>{

    });
    console.log("Dispatching order:", selectedOrder);
    // Clear the selected order
    setSelectedOrder(null);
  };

  const columns = [
    {
      name: "_id",
      label: "Id",
      options: {
        display: false
      }
    },
    {
      name: "rowNumber",
      label: "Order",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <span>{tableMeta.rowIndex + 1}</span>
        ),
      },
    },
    {
      name: "email",
      label: "User Email",

    },
    
    {
      name: "products",
      label: "Products",
      options: {
        customBodyRender: (products) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {products.map((product, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.title}
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '20px',
                      height: '20px',
                      background: '#3b3e41',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: "10px",
                      color: '#fff',
                    }}
                    className="p-2">
                    {product.quantity}
                  </div>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  {product.title}
                </div>
              </div>
            ))}
          </div>
        ),
      },
    },    
    {
      name: "totalPrice",
      label: "Price",
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta) => {
          const order = orders[tableMeta.rowIndex];
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="status" style={makeStyle(value)}>
                {value}
              </span>

              {value === "processing" && (
                <>
                  <EditIcon
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => setSelectedOrder(order)}
                  />
                  <Modal open={selectedOrder !== null}>
                    <div className="modal">
                      <div className="modal-content">
                        <p>Do you want to dispatch this order?</p>
                        <div className="modal-actions">
                          <button className="yes" onClick={handleDispatchOrder}>Dispatch</button>
                          <button className="no" onClick={() => setSelectedOrder(null)}>Cancel</button>
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
    {
      name: "paymentMethod",
      label: "Payment",
    },
    {
      name: "address",
      label: "Address",
    },
    {
      name: "createdAt",
      label: "Placement",
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
    responsive: "vertical",
    rowsPerPage: 10,
    selectableRows: 'none',
    rowsPerPageOptions: [10, 25, 50],
  };

  return (
    <div>
      <MUIDataTable 
        title="Orders"
        data={orders}
        columns={columns}
        options={options}
      />
    </div>
  );
}

export default OrdersTable;
