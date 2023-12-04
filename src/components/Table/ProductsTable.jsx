
import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Modal from "@mui/material/Modal";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import axios from "axios";

const ProductsTable = () => {
  const [productList, setProductList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
 const [productId, setProductId] = useState('');
  const handleEdit = ((productId) => {
    setEditModalOpen(true);
   setProductId(productId);
    
  });

  const handleDelete = async (productId) => {
    
    try {
      const response = await axios.delete(`https://dollarwala-server-production.up.railway.app/api/products/${productId}`);
      console.log("product deleted successfully");
      await fetchProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productList]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://dollarwala-server-production.up.railway.app/api/products"); 
      const data = await response.json();

      const productList = data.map((product) => ({
        _id :  product._id,
        title: product.title,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
        image: `https://dollarwala-server-production.up.railway.app/${product.image}`,
        category: product.category,
      }));
      setProductList(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const columns = [

    {
      name: "_id",
      label: "Product Id",
      options: {
        display: false
      },
    },

    {
      name: "rowNumber",
      label: "Product",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <span>{tableMeta.rowIndex + 1}</span>
        ),
      },
    },
    {
      name: "title",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "image",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <img src={value} alt="Product" style={{ width: "50px" }} />
        ),
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: true,
        sort: true,
      },
    },
    
    {
      name: "quantity",
      label: "Quantity",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
        name: "actions", // Custom column for Edit and Delete buttons
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const productId = tableMeta.rowData[0]; // Assuming productId is in the 0th column
            return (
              <div>
                <button
                  style={{
                    background: "green",
                    color: "white",
                    marginRight: "5px",
                  }}
                  onClick={() => handleEdit(productId)}
                >
                  Edit
                </button>
                <button
                  style={{
                    background: "red",
                    color: "white",
                  }}
                  onClick={() => handleDelete(productId)}
                >
                  Delete
                </button>
              </div>
            );
          },
        },
    }
  ];

  const options = {
    filter: true,
    rowsPerPage: 10,
    selectableRows: 'none',
    rowsPerPageOptions: [10, 25, 50],
    customToolbar: () => {
      return ( 
          <button onClick={handleOpenModal}>Add</button>          
      );
    },
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditModalOpen(false);
  };

  return (
     <div>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div>
          <AddForm onClose={handleCloseModal} /> 
        </div>
      </Modal>
      <Modal open={isEditModalOpen} onClose={handleCloseModal}  >
        <div>
          <EditForm onClose={handleCloseModal} productId={productId} /> 
        </div>
      </Modal>
      <div>
        <MUIDataTable
          title="Products"
          data={productList}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
}

export default ProductsTable;